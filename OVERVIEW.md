# StoryForge — Interactive Storytelling App (Supabase + ElevenLabs)

## Overview

StoryForge is a web app that allows users to create and experience interactive stories enhanced by AI narration.  
It combines **Supabase** (for auth, storage, and real-time collaboration) with **ElevenLabs** (for natural-sounding AI voices).

The goal is to make storytelling more immersive — users can write, assign characters with unique voices, and add sound effects for a rich audio experience.

This project serves as:

- A **portfolio piece** showcasing full-stack development with Supabase + Next.js.
- A **practical demo** of ElevenLabs integrations in creative/educational apps.
- A foundation for potential future monetization (story-sharing, premium voices, collaboration tools).

---

## Core MVP (3–5 hours scope)

- **Authentication**: Supabase auth (email or OAuth).
- **Dashboard UI**: Clean, minimal Next.js + Tailwind dashboard.
- **Story Creation**:
  - User can create a new story and save it in Supabase.
  - Text input editor for writing story content.
- **Narrator Voice**: User selects a main narrator voice (ElevenLabs).
- **Playback**: Generate and play back the audio version of the story (text-to-speech).

---

## Nice-to-Have Features (future expansion)

- **Character Voices**: Assign characters in the story with different ElevenLabs voices.
- **Sound Effects**: Add background sounds or effects between segments.
- **Collaboration**: Multiple users can co-author stories in real time (Supabase real-time).
- **Story Library**: Public/private sharing of stories with playback.
- **Interactive Editing**: Inline tagging for characters (`@character`) and sound triggers.
- **Analytics**: Track listens, likes, or completion rate of stories.

---

## Design & Architecture Brief

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, shadcn/ui for clean UI components.
- **Backend/Storage**: Supabase for auth, Postgres DB, and file storage (if audio files saved).
- **API Integration**: ElevenLabs API for TTS generation.
- **Deployment**: Vercel (frontend + serverless functions), Supabase hosted backend.

### Key Architecture Points

- **Schema**:
  - `users`: auth-managed by Supabase.
  - `stories`: id, user_id, title, content, narrator_voice, created_at.
  - (Future) `characters`, `sound_effects`.
- **Audio Handling**:
  - MVP: generate audio on demand via ElevenLabs API (no storage).
  - Future: cache/store audio in Supabase storage for replays.
- **UI/UX**:
  - Simple dashboard with "Create New Story" CTA.
  - Story editor with sections for text input + voice preview.
  - Audio player embedded for playback.

### Portfolio Considerations

- Use **clean commit history** (feature-based commits).
- Add **short Loom demo** (screen-only, ~2min).
- Public GitHub repo with `README.md` explaining:
  - Project purpose
  - MVP vs future roadmap
  - Quick start guide

---

## Why This Project Works

- **Practical**: Not just storing text or reading it aloud — voices/characters add real creative value.
- **Scalable**: MVP is small, but the roadmap shows strong vision.
- **Relevant**: Highlights both Supabase and ElevenLabs naturally.
- **Portfolio-ready**: Looks polished even if MVP-only, but leaves room to expand.

---
