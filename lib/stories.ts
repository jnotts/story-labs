import { createClient } from "@/lib/supabase/client";
import { Story, CreateStoryData, UpdateStoryData } from "./types";

export async function createStory(
  data: CreateStoryData
): Promise<Story | null> {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("No authenticated user found");
    return null;
  }

  const { data: story, error } = await supabase
    .from("stories")
    .insert([
      {
        title: data.title,
        content: data.content,
        narrator_voice: data.narrator_voice || "alloy",
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating story:", error);
    return null;
  }

  return story;
}

export async function updateStory(
  id: string,
  data: UpdateStoryData
): Promise<Story | null> {
  const supabase = createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating story:", error);
    return null;
  }

  return story;
}

export async function getStories(): Promise<Story[]> {
  const supabase = createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("No authenticated user found");
    return [];
  }

  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }

  return stories || [];
}

export async function getStory(id: string): Promise<Story | null> {
  const supabase = createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching story:", error);
    return null;
  }

  return story;
}

export async function deleteStory(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("stories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting story:", error);
    return false;
  }

  return true;
}
