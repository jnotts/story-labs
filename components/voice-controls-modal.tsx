"use client";

import { Play, Square, X } from "lucide-react";
import { useAudioPreview } from "@/lib/hooks/useAudioPreview";
import { useState, useEffect } from "react";

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

interface VoiceControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: "pqHfZKP75CvOlQylNhV4",
    name: "Bill",
    description: "Friendly and comforting voice ready to narrate your stories.",
    previewUrl: "/audio/previews/bill.mp3",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description:
      "Matter-of-fact, personable woman. Great for conversational use cases.",
    previewUrl: "/audio/previews/rachel.mp3",
  },
  {
    id: "N2lVS1w4EtoT3dr4eOWO",
    name: "Callum",
    description: "Deceptively gravelly, yet unsettling edge.",
    previewUrl: "/audio/previews/callum.mp3",
  },
];

export function VoiceControlsModal({
  isOpen,
  onClose,
  selectedVoice,
  onVoiceSelect,
  speed,
  onSpeedChange,
}: VoiceControlsModalProps) {
  const { isPlaying, play, stop, currentPlaying } = useAudioPreview({ speed });
  const [isVisible, setIsVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handlePreview = (voice: VoiceOption) => {
    if (currentPlaying === voice.previewUrl && isPlaying) {
      stop();
    } else {
      play(voice.previewUrl);
    }
  };

  const handleClose = () => {
    setIsEntering(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match the animation duration
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger enter animation
      setTimeout(() => setIsEntering(true), 10);
    } else {
      setIsEntering(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop - subtle blur, click off modal to close */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal positioned next to right control panel */}
      <div
        className="absolute right-28 top-1/2 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-50%) translateX(${
            isEntering ? "0" : "calc(100% + 7rem)"
          })`,
        }}
      >
        {/* Connection indicator - subtle line connecting to control panel */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-px bg-gradient-to-r from-white/20 to-transparent"></div>

        <div className="relative glass-nav p-6 w-80 border border-white/10 shadow-2xl transform origin-right backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium opacity-90">Voice Controls</h2>
              <p className="text-xs opacity-50 mt-1">Choose your narrator</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Selection */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium opacity-70 mb-3">
              Select Voice
            </h3>
            {VOICE_OPTIONS.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedVoice === voice.id
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
                onClick={() => onVoiceSelect(voice.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium opacity-90">
                        {voice.name}
                      </h4>
                      {selectedVoice === voice.id && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full opacity-80" />
                      )}
                    </div>
                    <p className="text-xs opacity-60 mt-1">
                      {voice.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(voice);
                    }}
                    className="ml-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all opacity-70 hover:opacity-100"
                  >
                    {currentPlaying === voice.previewUrl && isPlaying ? (
                      <Square className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Speed Control */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">Speech Speed</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs opacity-60">
                <span>Slower</span>
                <span>{speed.toFixed(1)}x</span>
                <span>Faster</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
