"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavPillar } from "@/components/floating-nav";
import { ControlPanel } from "@/components/control-panel";
import { createStory, updateStory, getStory } from "@/lib/stories";
import { Story } from "@/lib/types";
import { useTTS } from "@/lib/hooks/useTTS";
import { VoiceControlsModal } from "@/components/voice-controls-modal";
import { RATE_LIMITS } from "@/lib/constants";
import { Play, Pause, Square, Volume2 } from "lucide-react";

export function StoryEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [remainingGenerations, setRemainingGenerations] = useState<
    number | null
  >(null);
  const [selectedVoice, setSelectedVoice] = useState("pqHfZKP75CvOlQylNhV4");
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [isVoiceControlsOpen, setIsVoiceControlsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // TTS functionality
  const {
    audioUrl,
    isLoading: isGenerating,
    error: ttsError,
    generate: originalGenerate,
    isPlaying,
    play,
    pause,
    stop,
  } = useTTS({
    text: content,
    voiceId: selectedVoice,
    speed: speechSpeed,
    enabled: true,
  });

  // Wrap generate to update remaining count
  const generate = () => {
    originalGenerate();
    // Optimistically update remaining count
    if (remainingGenerations !== null && remainingGenerations > 0) {
      setRemainingGenerations(remainingGenerations - 1);
    }
  };

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

  // Fetch remaining generations on load
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/usage");
        if (response.ok) {
          const data = await response.json();
          const used = data.tts_generations_count || 0;
          setRemainingGenerations(RATE_LIMITS.TTS_GENERATIONS_PER_DAY - used);
        }
      } catch (error) {
        console.error("Error fetching usage:", error);
      }
    };
    fetchUsage();
  }, []);

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
  // Handle text change with length limits
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= RATE_LIMITS.MAX_TTS_LENGTH) {
      setContent(newContent);
    }
  };

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
        onVoiceControlsOpen={() => setIsVoiceControlsOpen((prev) => !prev)}
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
                className="w-full bg-transparent rounded-lg px-4 py-3 text-2xl text-center story-title
                 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-70 focus:outline-none focus:ring-0
                 focus:placeholder:opacity-50 transition-all outline-none"
              />
            </div>
            <div className="h-px bg-white/5 mt-4 mx-auto w-32"></div>
          </div>

          {/* Main Writing Area - Infinite Feel */}
          <div className="flex-1 relative pb-24">
            <textarea
              placeholder="Once upon a time..."
              value={content}
              onChange={handleContentChange}
              className="w-full h-full bg-[#ffffff01] rounded-2xl p-6 resize-none hide-scrollbar story-text
              placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-70 focus:outline-none focus:ring-0
              text-lg focus:placeholder:opacity-50 transition-all outline-none"
              style={{
                overflow: "auto",
                paddingBottom: "120px",
              }}
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          {/* Main Stats & Save Pill */}
          <div className="glass-nav px-6 py-2 flex items-center gap-6">
            <div
              className={`text-xs ${
                content.length > RATE_LIMITS.MAX_TTS_LENGTH * 0.9
                  ? "text-orange-400 opacity-80"
                  : "opacity-40"
              }`}
            >
              {content.length}/{RATE_LIMITS.MAX_TTS_LENGTH}
            </div>
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
          </div>

          {/* Audio Controls Pill */}
          <div className="glass-nav rounded-full px-4 py-2 flex items-center gap-3">
            {/* Generate Audio Button */}
            {!audioUrl && (
              <div className="flex items-center gap-2">
                <button
                  onClick={generate}
                  disabled={
                    isGenerating ||
                    !content.trim() ||
                    content.trim().length > RATE_LIMITS.MAX_TTS_LENGTH ||
                    remainingGenerations === 0
                  }
                  className={`text-xs px-4 py-1 rounded-full transition-all flex items-center gap-2 ${
                    isGenerating ||
                    !content.trim() ||
                    content.trim().length > RATE_LIMITS.MAX_TTS_LENGTH ||
                    remainingGenerations === 0
                      ? " opacity-50 cursor-not-allowed"
                      : " hover:bg-white/20 opacity-80 hover:opacity-100"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3" />
                      Generate Audio
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Audio Controls */}
            {audioUrl && (
              <>
                <button
                  onClick={isPlaying ? pause : play}
                  disabled={isGenerating}
                  className={`text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 ${
                    isGenerating
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Play
                    </>
                  )}
                </button>

                <button
                  onClick={stop}
                  disabled={isGenerating}
                  className={`text-xs px-2 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
                    isGenerating
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Square className="w-3 h-3" />
                </button>

                <div className="w-px h-4 bg-white/10"></div>

                <button
                  onClick={generate}
                  disabled={isGenerating}
                  className={`text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 ${
                    isGenerating
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    "Regenerate"
                  )}
                </button>
              </>
            )}
            {remainingGenerations !== null && (
              <div
                className={`text-xs px-2 py-1 rounded-full bg-white/5 ${
                  remainingGenerations === 0 ? "text-red-400" : "text-white/60"
                }`}
              >
                {remainingGenerations} remaining today
              </div>
            )}

            {/* Error Display */}
            {ttsError && (
              <div className="text-xs text-red-400 opacity-70">
                {ttsError.message}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Voice Controls Modal */}
      <VoiceControlsModal
        isOpen={isVoiceControlsOpen}
        onClose={() => setIsVoiceControlsOpen(false)}
        selectedVoice={selectedVoice}
        onVoiceSelect={setSelectedVoice}
        speed={speechSpeed}
        onSpeedChange={setSpeechSpeed}
      />
    </div>
  );
}
