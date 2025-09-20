// Script to generate voice preview samples using ElevenLabs API
// Run this once to create the audio files: node scripts/generate-voice-previews.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOICES = [
  {
    id: "pqHfZKP75CvOlQylNhV4",
    name: "bill",
    previewText: "Once upon a time, in a land far away, there lived a wise old storyteller."
  },
  {
    id: "N2lVS1w4EtoT3dr4eOWO",
    name: "callum",
    previewText: "The shadows whispered secrets that only the brave dared to uncover."
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "rachel",
    previewText: "She opened the ancient book, and the words seemed to dance off the pages."
  }
];

async function generateVoicePreviews() {
  const outputDir = path.join(__dirname, '../public/audio/previews');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const voice of VOICES) {
    console.log(`Generating preview for ${voice.name}...`);

    try {
      const response = await fetch('http://localhost:3001/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: voice.previewText,
          voice_id: voice.id
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response is actually audio
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('audio/mpeg')) {
        const responseText = await response.text();
        throw new Error(`Expected audio/mpeg, got ${contentType}. Response: ${responseText.slice(0, 200)}...`);
      }

      const audioBuffer = await response.arrayBuffer();

      if (audioBuffer.byteLength === 0) {
        throw new Error(`Received empty audio buffer for ${voice.name}`);
      }

      const outputPath = path.join(outputDir, `${voice.name}.mp3`);
      fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

      console.log(`✅ Generated ${voice.name}.mp3 (${audioBuffer.byteLength} bytes)`);

    } catch (error) {
      console.error(`❌ Error generating ${voice.name}:`, error.message);
    }
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVoicePreviews()
    .then(() => console.log('🎉 Voice preview generation complete!'))
    .catch(console.error);
}

export { generateVoicePreviews };