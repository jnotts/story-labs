import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

interface TTSOptions {
  text: string;
  voiceId?: string;
  enabled?: boolean;
}

interface TTSResult {
  audioUrl?: string | null;
  isLoading: boolean;
  error: Error | null;
  generate: () => void;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

const generateTTSAudio = async ({
  text,
  voiceId,
}: {
  text: string;
  voiceId: string;
}): Promise<string> => {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate audio");
  }

  // Convert response to blob and create object URL
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
};

export const useTTS = ({
  text,
  voiceId = "pqHfZKP75CvOlQylNhV4",
  enabled = true,
}: TTSOptions): TTSResult => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();

  // Only generate if we have text content
  const hasContent = text && text.trim().length > 0;

  // Create cache key for this text + voice combination
  const cacheKey = ["tts", text.trim(), voiceId];

  // Check if we already have cached audio for this content
  const cachedAudioUrl = queryClient.getQueryData<string>(cacheKey);

  const {
    mutate,
    data: audioUrl,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: generateTTSAudio,
    onSuccess: (data) => {
      // Cache the result for future use
      queryClient.setQueryData(cacheKey, data, {
        // Cache for 30 minutes
        updatedAt: Date.now(),
      });
    },
    retry: 1,
  });

  // Use cached audio if available, otherwise use the latest generated audio
  const currentAudioUrl = cachedAudioUrl || audioUrl;

  const generate = () => {
    if (hasContent && enabled) {
      mutate({ text: text.trim(), voiceId });
    }
  };

  const play = () => {
    if (currentAudioUrl && !isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(currentAudioUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        audioRef.current = null;
      });

      audio.addEventListener("error", () => {
        setIsPlaying(false);
        audioRef.current = null;
      });

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
          audioRef.current = null;
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clean up object URLs to prevent memory leaks
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [currentAudioUrl]);

  return {
    audioUrl: currentAudioUrl,
    isLoading,
    error: error as Error | null,
    generate,
    isPlaying,
    play,
    pause,
    stop,
  };
};
