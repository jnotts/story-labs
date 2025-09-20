import { useState, useRef, useCallback } from "react";

interface AudioPreviewOptions {
  speed: number;
}

interface AudioPreviewResult {
  isPlaying: boolean;
  play: (audioUrl: string) => void;
  stop: () => void;
  currentPlaying: string | null;
}

export const useAudioPreview = ({ speed }: AudioPreviewOptions): AudioPreviewResult => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlaying(null);
    }
  }, []);

  const play = useCallback((audioUrl: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create new audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Set playback speed
    audio.playbackRate = speed;

    // Set up event listeners
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentPlaying(null);
    });

    audio.addEventListener("error", () => {
      setIsPlaying(false);
      setCurrentPlaying(null);
      console.error("Audio preview playback failed");
    });

    // Play the audio
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setCurrentPlaying(audioUrl);
      })
      .catch((error) => {
        console.error("Audio preview playback failed:", error);
        setIsPlaying(false);
        setCurrentPlaying(null);
      });
  }, [speed]);

  return {
    isPlaying,
    play,
    stop,
    currentPlaying,
  };
};