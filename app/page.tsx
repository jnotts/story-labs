import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;
  return (
    <main className="min-h-screen relative flex flex-col">
      {/* Minimal floating navigation */}
      <nav className="fixed top-6 left-6 right-6 z-50">
        <div className="glass-nav px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 opacity-70" />
            <span className="font-light text-lg">Story Labs</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center space-y-12 max-w-2xl">

          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              Transform Stories into{" "}
              <span className="opacity-70">
                Audio
              </span>
            </h1>

            <p className="text-lg opacity-60 leading-relaxed">
              Write. Choose a voice. Listen to your story come alive.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href={isAuthenticated ? "/create" : "/auth/login"}
              className="glass-cta inline-block"
            >
              {isAuthenticated ? "Continue Creating" : "Begin Creating"}
            </Link>

            <div className="text-xs opacity-40">
              No credit card required
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
