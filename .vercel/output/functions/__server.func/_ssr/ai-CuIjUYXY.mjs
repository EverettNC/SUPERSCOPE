import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as string, i as object, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-CuIjUYXY.js
var explainDiagnosis_createServerFn_handler = createServerRpc({
	id: "68489e16806542c3c73497dcb02152f227fede0adf65d4b056613611ad619793",
	name: "explainDiagnosis",
	filename: "src/lib/ai.ts"
}, (opts) => explainDiagnosis.__executeServer(opts));
var explainDiagnosis = createServerFn({ method: "POST" }).validator((input) => object({
	headline: string().max(200),
	summary: string().max(800),
	findings: array(object({
		severity: string(),
		title: string(),
		detail: string()
	})).max(12),
	symptom: string().nullable(),
	device: string().max(120)
}).parse(input)).handler(explainDiagnosis_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const findings = data.findings.slice(0, 8).map((f) => `- [${f.severity}] ${f.title}: ${f.detail}`).join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 280,
			temperature: .3,
			messages: [{
				role: "system",
				content: "You are a field technician writing to a non-expert. Two short paragraphs, then three numbered steps. No markdown headings. No fluff. Name the actual problem in the first sentence."
			}, {
				role: "user",
				content: `Device: ${data.device}\nThey said: ${data.symptom || "not specified"}\nVerdict: ${data.headline}\n${data.summary}\nFindings:\n${findings}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const text = (await res.json()).choices[0]?.message.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Empty reply."
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { explainDiagnosis_createServerFn_handler };
