import { createClient } from "@/lib/supabase/server";
import { RATE_LIMITS, type UsageStats } from "@/lib/constants";

export async function getUserDailyUsage(userId: string): Promise<UsageStats | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching user usage:', error);
    return null;
  }

  return data || {
    tts_generations_count: 0,
    total_characters_generated: 0,
    date: today,
  };
}

export async function incrementTTSUsage(userId: string, charactersGenerated: number): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    // Use upsert to either insert new record or update existing
    const { error } = await supabase
      .from('user_usage')
      .upsert({
        user_id: userId,
        date: today,
        tts_generations_count: 1,
        total_characters_generated: charactersGenerated,
      }, {
        onConflict: 'user_id,date',
        // On conflict, increment the values
      });

    if (error) {
      // If upsert fails, try manual increment
      const { error: updateError } = await supabase.rpc('increment_tts_usage', {
        user_id_param: userId,
        characters_param: charactersGenerated,
        date_param: today,
      });

      if (updateError) {
        console.error('Error incrementing TTS usage:', updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in incrementTTSUsage:', error);
    return false;
  }
}

export async function checkRateLimit(userId: string, textLength: number): Promise<{
  allowed: boolean;
  reason?: string;
  current?: UsageStats;
}> {
  // Check text length limit
  if (textLength > RATE_LIMITS.MAX_TTS_LENGTH) {
    return {
      allowed: false,
      reason: `Text too long. Maximum ${RATE_LIMITS.MAX_TTS_LENGTH} characters allowed per generation.`,
    };
  }

  // Get current usage
  const usage = await getUserDailyUsage(userId);
  if (!usage) {
    return {
      allowed: false,
      reason: 'Unable to check usage limits. Please try again.',
    };
  }

  // Check daily generation limit
  if (usage.tts_generations_count >= RATE_LIMITS.TTS_GENERATIONS_PER_DAY) {
    return {
      allowed: false,
      reason: `Daily limit reached. You can generate ${RATE_LIMITS.TTS_GENERATIONS_PER_DAY} audio files per day.`,
      current: usage,
    };
  }

  return {
    allowed: true,
    current: usage,
  };
}