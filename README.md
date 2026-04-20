# Story Labs

Interactive storytelling app with AI narration.

## Project Brief
Create an interactive storytelling platform where users write stories and generate AI narration. Focus on creative writing experience with glassmorphism UI over mountain backgrounds.

## Tech Stack
- **Frontend**: Next.js 14 App Router, React, TailwindCSS with custom glassmorphism styling
- **Backend**: Supabase for authentication and PostgreSQL database with Row Level Security
- **UI Components**: shadcn/ui heavily customized for liquid glass aesthetic
- **Future TTS**: ElevenLabs API integration planned for voice narration

## Architecture Choices
- **SSR Authentication**: Supabase SSR with proper middleware for session management across client/server
- **Glassmorphism Design**: Custom CSS variables and floating panels instead of traditional SaaS layouts
- **Auto-save System**: Debounced saves with real-time status indicators for seamless writing experience
- **Pillar Navigation**: Minimal floating side panels for navigation and controls

## Current Features
- ✅ User authentication (email/password)
- ✅ Story creation and editing with auto-save
- ✅ Personal story library with CRUD operations
- ✅ Glassmorphism UI with mountain background
- ✅ Real-time word count and save status
- ✅ Responsive floating navigation pillars
- ✅ ElevenLabs TTS integration for voice narration
- ✅ Voice selection per story
- ✅ Audio playback controls

## Setup

1. Clone and install:
```bash
npm install
```

2. Set up Supabase:
```bash
# Create .env with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

3. Run database schema from `database-schema.sql` in Supabase SQL Editor

4. Start development:
```bash
npm run dev
```
