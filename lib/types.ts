export interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  narrator_voice: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoryData {
  title: string;
  content: string;
  narrator_voice?: string;
}

export interface UpdateStoryData {
  title?: string;
  content?: string;
  narrator_voice?: string;
}