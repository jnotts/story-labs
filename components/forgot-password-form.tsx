"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="glass-panel p-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              Password reset instructions have been sent to your email.
            </p>
            <p className="text-sm opacity-70">
              If you don&apos;t see the email, check your spam folder.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-button border-0 bg-white/10 backdrop-blur-sm"
                />
              </div>

              {error && (
                <div className="glass-panel p-4 bg-red-500/10 border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="glass-cta w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm opacity-70">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="opacity-100 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
