import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm opacity-70">
        {user.email?.split('@')[0]}
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/auth/login" className="glass-button text-sm">
        Sign In
      </Link>
      <Link href="/auth/sign-up" className="glass-cta text-sm">
        Sign Up
      </Link>
    </div>
  );
}
