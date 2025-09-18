import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavPillar } from "@/components/floating-nav";
import { ControlPanel } from "@/components/control-panel";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Left Navigation Pillar */}
      <NavPillar activeSection="create" />

      {/* Right Control Panel */}
      <ControlPanel mode="create" />

      {/* Central Creative Space */}
      <main className="px-24 py-16 h-screen flex flex-col">
        {/* Floating Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light mb-3 opacity-60">
            Begin Your Story
          </h1>
          <p className="text-sm opacity-40">
            Let your imagination flow into the infinite space...
          </p>
        </div>

        {/* Infinite Writing Space */}
        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
          {/* Title Input */}
          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Untitled Story"
                className="w-full bg-transparent rounded-lg px-4 py-3 text-2xl font-light text-center
                 placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:ring-0 
                 focus:placeholder:opacity-50  transition-all outline-none"
              />
            </div>
            <div className="h-px bg-white/5 mt-4 mx-auto w-32"></div>
          </div>

          {/* Main Writing Area - Infinite Feel */}
          <div className="flex-1 relative pb-24">
            <textarea
              placeholder="Once upon a time..."
              className="w-full h-full bg-[#ffffff01] rounded-2xl p-6 resize-none hide-scrollbar
              placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:ring-0
              text-lg leading-relaxed focus:placeholder:opacity-50 transition-all outline-none"
              style={{
                overflow: "auto",
                paddingBottom: "120px"
              }}
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <div className="glass-nav px-6 py-3 flex items-center gap-6">
            <div className="text-xs opacity-40">0 words</div>
            <div className="w-px h-4 bg-white/10"></div>
            <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
              Save Draft
            </button>
            <button className="text-xs bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              Generate Audio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
