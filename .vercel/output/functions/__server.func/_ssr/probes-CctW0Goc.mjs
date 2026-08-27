import { t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, s as unknown } from "../_libs/zod.mjs";
import { a as createSsrRpc } from "./createSsrRpc-CRUGmq6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/probes-CctW0Goc.js
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function mintCode() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(8));
	let s = "";
	for (const b of bytes) s += ALPHABET[b % 32];
	return `${s.slice(0, 4)}-${s.slice(4)}`;
}
function normalizeCode(raw) {
	const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (compact.length !== 8) return raw.trim().toUpperCase();
	return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}
var createProbe = createServerFn({ method: "POST" }).handler(createSsrRpc("05e50a3d7c5f14a2d5cdef517b7f3fb180b0956727505d341f52908487bdba1f"));
var getProbe = createServerFn({ method: "GET" }).validator((input) => object({ code: string().min(1) }).parse(input)).handler(createSsrRpc("9e88fbcdf1c5982a0632d904b537a09dd8aeb517d65f8973d159ee93f44192e0"));
var startProbe = createServerFn({ method: "POST" }).validator((input) => object({ code: string().min(1) }).parse(input)).handler(createSsrRpc("35ea96e7dab841dc9731f002dbd7e8c9effd60525887eb83ac329a6cd1f1bb08"));
var completeProbe = createServerFn({ method: "POST" }).validator((input) => object({
	code: string().min(1),
	telemetry: unknown(),
	diagnosis: unknown()
}).parse(input)).handler(createSsrRpc("b7e50b2760624703db69aff3394ffefcea078e651a5a34c6d68e1486dfc45068"));
//#endregion
export { normalizeCode as a, mintCode as i, createProbe as n, startProbe as o, getProbe as r, completeProbe as t };
