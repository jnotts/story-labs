import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sparkles, BookOpen, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Top navigation */}
      <nav className="fixed top-6 left-6 right-6 z-50">
        <div className="glass-nav px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 opacity-70" />
            <span className="font-bold text-lg">Story Labs</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel p-12 text-center space-y-8">
            <div className="inline-flex items-center gap-3 glass-button">
              <Play className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">AI-Powered Storytelling</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Transform Your Stories into{" "}
              <span className="opacity-80 font-light">
                Audio Magic
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Write captivating narratives and bring them to life with premium AI voices.
              Create immersive audio experiences that engage your audience like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/login" className="glass-cta inline-flex items-center gap-3">
                <BookOpen className="h-5 w-5" />
                Start Creating Stories
              </Link>

              <button className="glass-button">
                <Play className="h-4 w-4 mr-2" />
                Listen to Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center">
                <BookOpen className="h-8 w-8 opacity-70" />
              </div>
              <h3 className="text-xl font-semibold">Intuitive Writing</h3>
              <p className="text-muted-foreground">
                Clean, distraction-free editor designed for storytellers. Focus on your narrative.
              </p>
            </div>

            <div className="glass-panel p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center">
                <Sparkles className="h-8 w-8 opacity-70" />
              </div>
              <h3 className="text-xl font-semibold">Premium AI Voices</h3>
              <p className="text-muted-foreground">
                Choose from a library of natural-sounding voices to narrate your stories.
              </p>
            </div>

            <div className="glass-panel p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center">
                <Play className="h-8 w-8 opacity-70" />
              </div>
              <h3 className="text-xl font-semibold">Instant Audio</h3>
              <p className="text-muted-foreground">
                Generate high-quality audio from your text with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
