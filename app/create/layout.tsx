import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  // Redirect to login if not authenticated
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen relative">
      {/* Minimal top bar with auth controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <ThemeSwitcher />
        <AuthButton />
      </div>

      {/* Clean main content area */}
      {children}
    </main>
  );
}
