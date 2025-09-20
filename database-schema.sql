-- StoryForge Database Schema
-- Run this in your Supabase SQL Editor

-- Create stories table
CREATE TABLE stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  narrator_voice text DEFAULT 'alloy',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own stories
CREATE POLICY "Users can CRUD their own stories"
ON stories
FOR ALL
USING (auth.uid() = user_id);

-- Additional policy for INSERT (some setups need explicit INSERT policy)
CREATE POLICY "Users can insert their own stories"
ON stories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create user_usage table for rate limiting
CREATE TABLE user_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  tts_generations_count integer DEFAULT 0,
  total_characters_generated integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security for user_usage
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own usage data
CREATE POLICY "Users can access their own usage"
ON user_usage
FOR ALL
USING (auth.uid() = user_id);

-- Create trigger for user_usage updated_at
CREATE TRIGGER update_user_usage_updated_at
    BEFORE UPDATE ON user_usage
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create function to increment TTS usage
CREATE OR REPLACE FUNCTION increment_tts_usage(
    user_id_param uuid,
    characters_param integer,
    date_param date
)
RETURNS void AS $$
BEGIN
    INSERT INTO user_usage (user_id, date, tts_generations_count, total_characters_generated)
    VALUES (user_id_param, date_param, 1, characters_param)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        tts_generations_count = user_usage.tts_generations_count + 1,
        total_characters_generated = user_usage.total_characters_generated + characters_param,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;