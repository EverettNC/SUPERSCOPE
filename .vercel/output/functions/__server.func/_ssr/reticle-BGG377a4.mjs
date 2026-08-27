import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reticle-BGG377a4.js
var import_jsx_runtime = require_jsx_runtime();
function Reticle({ progress, live = true }) {
	const pct = Math.max(0, Math.min(100, progress));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto size-52 sm:size-64",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 200 200",
			className: "size-full text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r: "88",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.18",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r: "62",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.28",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r: "18",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.7",
					strokeWidth: "1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M100 8 v28 M100 164 v28 M8 100 h28 M164 100 h28",
					stroke: "currentColor",
					strokeOpacity: "0.7",
					strokeWidth: "1.4"
				}),
				live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					className: "scan-ring origin-center",
					style: { transformBox: "fill-box" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "100",
						cy: "100",
						r: "70",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.35",
						strokeWidth: "1"
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r: "88",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeDasharray: `${pct / 100 * 552} 552`,
					strokeLinecap: "butt",
					transform: "rotate(-90 100 100)"
				}),
				live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					className: "scan-sweep origin-center",
					style: {
						transformBox: "fill-box",
						transformOrigin: "100px 100px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M100 100 L100 14",
						stroke: "currentColor",
						strokeWidth: "1.2",
						strokeOpacity: "0.85"
					})
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xl tabular-nums text-fg",
				children: Math.round(pct)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] tracking-[0.18em] text-muted uppercase",
				children: live ? "probing" : "locked"
			})]
		})]
	});
}
//#endregion
export { Reticle as t };
