import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
