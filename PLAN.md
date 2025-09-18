# StoryForge MVP - 2 Hour Speed-Run Plan

## Goal
Build and deploy a functional interactive storytelling app with Supabase auth and ElevenLabs TTS in 120 minutes MAX.

## Time Allocation (2 hours total)
- **Setup & Auth (30 min)**: Supabase config, basic auth flow
- **Core Story CRUD (40 min)**: Database schema, story creation/editing
- **ElevenLabs Integration (35 min)**: TTS API, audio playback
- **Polish & Deploy (15 min)**: Final touches, Vercel deployment

---

## Phase 1: Foundation Setup (0-30 min)

### Supabase Setup (15 min)
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Set up auth providers (email + Google OAuth)
- [ ] Test auth connection

### Database Schema (15 min)
```sql
-- stories table
CREATE TABLE stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  narrator_voice text DEFAULT 'alloy',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD their own stories" ON stories FOR ALL USING (auth.uid() = user_id);
```

---

## Phase 2: Core Story Management + Glassmorphism UI (30-70 min)

### Phase 2A: Core Layout Foundation ✅ COMPLETE
- [x] Replace generic dashboard with floating glass panel layout
- [x] Implement base color palette (light/dark backgrounds, glass panels)
- [x] Set up custom CSS variables for glassmorphism effects
- [x] Create floating navigation component (minimal, side/overlay)
- [x] **UPGRADED**: Built unified pillar system for nav + controls
- [x] **UPGRADED**: Created infinite writing space with mountain background
- [x] **UPGRADED**: Implemented seamless text input with hidden scrollbars

### Phase 2B: Story Management UI (20 min) 🚧 NEXT
- [ ] Connect story creation to Supabase database
- [ ] Implement save/load story functionality
- [ ] Create library view for browsing existing stories
- [ ] Add story CRUD operations (create, read, update, delete)

### Phase 2C: Polish & Micro-interactions (5 min during Phase 4)
- [ ] Add subtle animations (fade-in panels, hover glows)
- [ ] Implement scroll parallax effects
- [ ] Add breathing shadows and micro-interactions

### UI Design Decisions:
- **Skip generic shadcn styling** - use components but heavily customize
- **Focus on glass panels** over traditional cards/containers
- **Storytelling flow** - scroll-based navigation, not rigid nav bars
- **Gradient accents** for CTAs (indigo→purple, teal highlights)
- **Floating audio player** for Phase 3

### Technical Approach:
- Custom CSS classes for glassmorphism effects
- Tailwind utilities + custom properties for gradients
- Framer Motion or CSS animations for scroll effects
- Replace default shadcn styles with glass aesthetic

---

## Phase 3: ElevenLabs Integration (70-105 min)

### API Setup (10 min)
- [ ] ElevenLabs API key configuration
- [ ] Create `/api/tts` endpoint
- [ ] Voice list fetching

### TTS Implementation (25 min)
- [ ] Text-to-speech generation function
- [ ] Audio player component
- [ ] "Generate Audio" button in story editor
- [ ] Loading states and error handling

---

## Phase 4: Polish & Deploy (105-120 min)

### Final Touches (10 min)
- [ ] Basic responsive design
- [ ] Loading spinners
- [ ] Error messages
- [ ] Audio controls (play/pause/stop)

### Deployment (5 min)
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test production build

---

## MVP Feature Scope (STRICT)

###  INCLUDE
- Email auth (Supabase)
- Story CRUD operations
- Single narrator voice per story
- Generate audio on-demand (no caching)
- Basic responsive UI

### L EXCLUDE (Future features)
- Character voices
- Sound effects
- Real-time collaboration
- Story sharing/library
- Audio caching/storage
- Complex text editor
- Analytics

---

## Tech Stack (Confirmed)
- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **UI**: shadcn/ui components
- **Backend**: Supabase (auth + database)
- **TTS**: ElevenLabs API
- **Deployment**: Vercel

---

## API Endpoints Needed
```
GET  /api/voices        # Get available ElevenLabs voices
POST /api/tts           # Generate audio from text
```

---

## Database Schema (Final)
```sql
stories:
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- title (text, required)
- content (text, required)
- narrator_voice (text, default 'alloy')
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Success Criteria
1.  User can sign up/login
2.  User can create/edit/delete stories
3.  User can select narrator voice
4.  User can generate and play audio of their story
5.  App is deployed and accessible via URL

**Estimated completion: 120 minutes or less**