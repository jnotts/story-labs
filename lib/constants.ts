// Rate limit constants - safe for client and server
export const RATE_LIMITS = {
  TTS_GENERATIONS_PER_DAY: 3,
  MAX_STORY_LENGTH: 2000, // characters
  MAX_TTS_LENGTH: 2000, // characters per generation
} as const;

export interface UsageStats {
  tts_generations_count: number;
  total_characters_generated: number;
  date: string;
}