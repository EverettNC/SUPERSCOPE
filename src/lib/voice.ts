import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function forNeural(text: string): string {
  return text
    .replace(/\s*\[long-pause\]\s*/gi, ". ")
    .replace(/\s*\[pause\]\s*/gi, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

async function grokAra(text: string): Promise<{ audio: string; type: string } | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text,
      voice_id: "leo",
      language: "en",
    }),
  });
  if (!res.ok) return null;
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength < 100) return null;
  return {
    audio: bytesToB64(bytes),
    type: res.headers.get("content-type") || "audio/mpeg",
  };
}

async function avaNeural(text: string): Promise<{ audio: string; type: string }> {
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    "en-US-GuyNeural",
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  );
  const { audioStream } = tts.toStream(forNeural(text), { rate: 0.92 });
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  tts.close();
  const bytes = new Uint8Array(Buffer.concat(chunks));
  if (bytes.byteLength < 100) {
    throw new Error("empty audio");
  }
  return { audio: bytesToB64(bytes), type: "audio/mpeg" };
}

export const synthesize = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        text: z.string().min(1).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    try {
      const grok = await grokAra(data.text);
      if (grok) return { ok: true as const, ...grok };
      const neural = await avaNeural(data.text);
      return { ok: true as const, ...neural };
    } catch {
      return { ok: false as const, error: "Voice didn't come through. Tap again." };
    }
  });
