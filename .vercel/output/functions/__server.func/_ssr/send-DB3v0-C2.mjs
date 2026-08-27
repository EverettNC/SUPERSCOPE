import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, r as Shell, t as BackLink } from "./createSsrRpc-CRUGmq6G.mjs";
import { i as mintCode, n as createProbe } from "./probes-CctW0Goc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-DB3v0-C2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SendPage() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const open = (0, import_react.useCallback)(async () => {
		setBusy(true);
		setError(null);
		try {
			const res = await Promise.race([createProbe(), new Promise((_, reject) => {
				window.setTimeout(() => reject(/* @__PURE__ */ new Error("timeout")), 4e3);
			})]);
			const code = res.ok ? res.code : mintCode();
			await navigate({
				to: "/session/$code",
				params: { code }
			});
		} catch {
			await navigate({
				to: "/session/$code",
				params: { code: mintCode() }
			});
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		open();
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-fg",
				children: "Could not open a probe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [error, " Scan this computer or use the lab instead."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: () => void open(),
				disabled: busy,
				children: "Try again"
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-sm text-muted",
		children: "Opening a session…"
	})] });
}
//#endregion
export { SendPage as component };
