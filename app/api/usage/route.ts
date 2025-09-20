import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserDailyUsage } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get user's daily usage
    const usage = await getUserDailyUsage(user.id);

    if (!usage) {
      return NextResponse.json({ error: "Unable to fetch usage data" }, { status: 500 });
    }

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch usage data" },
      { status: 500 }
    );
  }
}