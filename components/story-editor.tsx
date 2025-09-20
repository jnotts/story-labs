"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavPillar } from "@/components/floating-nav";
import { ControlPanel } from "@/components/control-panel";
import { createStory, updateStory, getStory } from "@/lib/stories";
import { Story } from "@/lib/types";
import { Tooltip } from "@/components/tooltip";

export function StoryEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load story if editing
  useEffect(() => {
    const loadStory = async () => {
      // Check if we're editing an existing story
      const editId = searchParams.get("edit");
      if (editId) {
        const story = await getStory(editId);
        if (story) {
          setCurrentStory(story);
          setTitle(story.title);
          setContent(story.content);
          setSaveStatus("saved");
        }
      } else {
        // Fresh load - ensure blank slate
        setCurrentStory(null);
        setTitle("");
        setContent("");
        setSaveStatus("saved");
      }
    };
    loadStory();
  }, [searchParams]);

  // Update word count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Save story function
  const saveStory = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;

    setSaveStatus("saving");

    try {
      if (currentStory) {
        // Update existing story
        const updated = await updateStory(currentStory.id, { title, content });
        if (updated) {
          setCurrentStory(updated);
          setSaveStatus("saved");
        }
      } else {
        // Create new story
        const newStory = await createStory({
          title: title || "Untitled Story",
          content,
        });
        if (newStory) {
          setCurrentStory(newStory);
          setSaveStatus("saved");
        }
      }
    } catch (error) {
      console.error("Error saving story:", error);
      setSaveStatus("unsaved");
    }
  }, [title, content, currentStory]);

  // Mark as unsaved when content changes
  useEffect(() => {
    if (currentStory) {
      // Editing existing story - check if different from saved version
      if (title !== currentStory.title || content !== currentStory.content) {
        setSaveStatus("unsaved");
      } else {
        setSaveStatus("saved");
      }
    } else {
      // Creating new story - mark as unsaved if there's any content
      if (title.trim() || content.trim()) {
        setSaveStatus("unsaved");
      } else {
        setSaveStatus("saved");
      }
    }
  }, [title, content, currentStory]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    const timeoutId = setTimeout(() => {
      if (saveStatus === "unsaved") {
        saveStory();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [title, content, saveStatus, saveStory]);

  // Create new story function
  const handleCreateNew = useCallback(async () => {
    const hasContent = title.trim() || content.trim();

    if (hasContent) {
      // Auto-save current work first
      await saveStory();
    }

    // Navigate to fresh create page
    router.push("/create");
  }, [title, content, saveStory, router]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Left Navigation Pillar */}
      <NavPillar activeSection="create" onCreateNew={handleCreateNew} />

      {/* Right Control Panel */}
      <ControlPanel
        mode="create"
        isEditing={!!currentStory}
        onCreateNew={handleCreateNew}
      />

      {/* Central Creative Space */}
      <main className="px-24 py-16 h-screen flex flex-col">
        {/* Floating Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light mb-3 opacity-60">
            Begin Your Story
          </h1>
          <p className="text-sm opacity-40">
            Let your imagination flow into the infinite space...
          </p>
        </div>

        {/* Infinite Writing Space */}
        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
          {/* Title Input */}
          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Untitled Story"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent rounded-lg px-4 py-3 text-2xl font-light text-center
                 placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:ring-0
                 focus:placeholder:opacity-50  transition-all outline-none"
              />
            </div>
            <div className="h-px bg-white/5 mt-4 mx-auto w-32"></div>
          </div>

          {/* Main Writing Area - Infinite Feel */}
          <div className="flex-1 relative pb-24">
            <textarea
              placeholder="Once upon a time..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-[#ffffff01] rounded-2xl p-6 resize-none hide-scrollbar
              placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:ring-0
              text-lg leading-relaxed focus:placeholder:opacity-50 transition-all outline-none"
              style={{
                overflow: "auto",
                paddingBottom: "120px",
              }}
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <div className="glass-nav px-6 py-3 flex items-center gap-6">
            <div className="text-xs opacity-40">{wordCount} words</div>
            <div className="w-px h-4 bg-white/10"></div>
            <button
              onClick={saveStory}
              className={`text-xs transition-opacity text-center ${
                saveStatus === "saving"
                  ? "opacity-40"
                  : "opacity-60 hover:opacity-100"
              }`}
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved"
                : "Save"}
            </button>
            <div className="">
              <Tooltip content="Coming Soon">
                <button className="w-full text-xs bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all opacity-50 cursor-not-allowed">
                  Generate Audio
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
