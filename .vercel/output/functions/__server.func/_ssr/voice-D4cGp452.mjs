import { o as __toESM } from "../_runtime.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/voice-D4cGp452.js
function bytesToB64(bytes) {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin);
}
function forNeural(text) {
	return text.replace(/\s*\[long-pause\]\s*/gi, ". ").replace(/\s*\[pause\]\s*/gi, ". ").replace(/\s+/g, " ").trim();
}
async function grokAra(text) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text,
			voice_id: "leo",
			language: "en"
		})
	});
	if (!res.ok) return null;
	const bytes = new Uint8Array(await res.arrayBuffer());
	if (bytes.byteLength < 100) return null;
	return {
		audio: bytesToB64(bytes),
		type: res.headers.get("content-type") || "audio/mpeg"
	};
}
async function avaNeural(text) {
	const { MsEdgeTTS, OUTPUT_FORMAT } = await import("../_libs/msedge-tts.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const tts = new MsEdgeTTS();
	await tts.setMetadata("en-US-GuyNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
	const { audioStream } = tts.toStream(forNeural(text), { rate: .92 });
	const chunks = [];
	for await (const chunk of audioStream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	tts.close();
	const bytes = new Uint8Array(Buffer.concat(chunks));
	if (bytes.byteLength < 100) throw new Error("empty audio");
	return {
		audio: bytesToB64(bytes),
		type: "audio/mpeg"
	};
}
var synthesize_createServerFn_handler = createServerRpc({
	id: "e0b42287816bcfd729f7de509177e8591b58a7891b72fc7f1291e23662aff5e2",
	name: "synthesize",
	filename: "src/lib/voice.ts"
}, (opts) => synthesize.__executeServer(opts));
var synthesize = createServerFn({ method: "POST" }).validator((input) => object({ text: string().min(1).max(2e3) }).parse(input)).handler(synthesize_createServerFn_handler, async ({ data }) => {
	try {
		const grok = await grokAra(data.text);
		if (grok) return {
			ok: true,
			...grok
		};
		return {
			ok: true,
			...await avaNeural(data.text)
		};
	} catch {
		return {
			ok: false,
			error: "Voice didn't come through. Tap again."
		};
	}
});
//#endregion
export { synthesize_createServerFn_handler };
