"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavPillar } from "@/components/floating-nav";
import { ControlPanel } from "@/components/control-panel";
import { getStories, deleteStory } from "@/lib/stories";
import { Story } from "@/lib/types";
import { Clock, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";

export default function LibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; story: Story | null }>({
    isOpen: false,
    story: null,
  });
  const router = useRouter();

  // Load stories
  useEffect(() => {
    const loadStories = async () => {
      const fetchedStories = await getStories();
      setStories(fetchedStories);
      setLoading(false);
    };

    loadStories();
  }, []);

  const handleDeleteStory = (story: Story) => {
    setDeleteModal({ isOpen: true, story });
  };

  const confirmDelete = async () => {
    if (!deleteModal.story) return;

    const success = await deleteStory(deleteModal.story.id);
    if (success) {
      setStories(stories.filter(s => s.id !== deleteModal.story!.id));
    }
    setDeleteModal({ isOpen: false, story: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, story: null });
  };

  const handleEditStory = (story: Story) => {
    // Navigate to create page with story data
    router.push(`/create?edit=${story.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Left Navigation Pillar */}
      <NavPillar activeSection="library" />

      {/* Right Control Panel */}
      <ControlPanel mode="library" />

      {/* Central Library Space */}
      <main className="px-24 py-16 h-screen flex flex-col">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light mb-3 opacity-60">
            Your Stories
          </h1>
          <p className="text-sm opacity-40">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} in your library
          </p>
        </div>

        {/* Stories Grid */}
        <div className="flex-1 max-w-6xl mx-auto w-full">
          {loading ? (
            <div className="text-center opacity-50">Loading your stories...</div>
          ) : stories.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="opacity-50">No stories yet</p>
              <button
                onClick={() => router.push('/create')}
                className="glass-cta"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="glass-panel p-6 space-y-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleEditStory(story)}
                >
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg line-clamp-2">
                      {story.title || "Untitled Story"}
                    </h3>
                    <p className="text-sm opacity-60 line-clamp-3">
                      {story.content || "No content yet..."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs opacity-40">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(story.updated_at)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(story);
                      }}
                      className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Story"
        message={`Are you sure you want to delete "${deleteModal.story?.title || 'this story'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}