import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, incrementTTSUsage } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // 1. Get request data
    const { text, voice_id = "pqHfZKP75CvOlQylNhV4" } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "Missing ElevenLabs API key" },
        { status: 500 }
      );
    }

    // 2. Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 3. Check rate limits
    const trimmedText = text.trim();
    const rateCheck = await checkRateLimit(user.id, trimmedText.length);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: rateCheck.reason,
          usage: rateCheck.current
        },
        { status: 429 }
      );
    }

    console.log("Generating TTS...");

    // 4. Initialize ElevenLabs client
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    // 5. Generate audio using ElevenLabs SDK
    const audioStream = await elevenlabs.textToSpeech.convert(voice_id, {
      text: trimmedText,
      modelId: "eleven_turbo_v2",
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.5,
      },
    });

    // 6. Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = audioStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    // 7. Combine chunks into single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // 8. Update usage tracking
    await incrementTTSUsage(user.id, trimmedText.length);

    // 9. Return audio
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      {
        error: "Text-to-speech service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
