import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-CE-Hy2DG.mjs";
import { n as Button, r as Shell, t as BackLink } from "./createSsrRpc-CRUGmq6G.mjs";
import { a as selectInput, n as copyFromElement, r as copyText } from "./store-CrYC-xFx.mjs";
import { t as ScanFlow } from "./scan-flow-cOKjzPG_.mjs";
import { n as getLab } from "./lab-C9vQJwYa.mjs";
import { r as saveProbeFile, t as buildProbeHtml } from "./probe-file-D8XxSXQ3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab._id-BXKWHbf0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LabPage() {
	const { id } = Route$1.useParams();
	const machine = getLab(id);
	const yorkieHtml = buildProbeHtml("YRK1-HELP");
	const sourceRef = (0, import_react.useRef)(null);
	const [yorkieHint, setYorkieHint] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (id === "yorkie") selectInput(sourceRef.current);
	}, [id]);
	if (!machine) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "That machine is not in the lab."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Home"
			})
		})
	] });
	async function copyYorkie() {
		if (copyFromElement(sourceRef.current)) {
			setYorkieHint("Copied. Paste into Notepad, Save As yorkie-probe.html, then send her that file.");
			return;
		}
		const ok = await copyText(yorkieHtml);
		setYorkieHint(ok ? "Copied. Paste into Notepad, Save As yorkie-probe.html, then send her that file." : "The probe is selected below. Copy it, paste into Notepad, Save As yorkie-probe.html, then send her that file.");
		selectInput(sourceRef.current);
	}
	async function sendYorkie() {
		const result = await saveProbeFile("YRK1-HELP", "yorkie-probe.html");
		if (result.saved) {
			setYorkieHint("Saved. Send her yorkie-probe.html.");
			return;
		}
		if (result.copied) setYorkieHint("This window cannot download files. The probe is copied. Open Notepad, paste, Save As yorkie-probe.html — then text her that file.");
		else setYorkieHint("Select the text below, copy it, paste into Notepad, Save As yorkie-probe.html, then send her that file.");
		requestAnimationFrame(() => selectInput(sourceRef.current));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, { label: "The lab" }),
		machine.id === "yorkie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mb-8 max-w-3xl rounded-xl bg-surface p-5 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "For Yorkie — no Grok login"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg",
					children: "Do not send her a link from this preview. Copy the probe, paste into Notepad, save as yorkie-probe.html, and send that file. She opens it, taps Allow. No account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void copyYorkie(),
						children: "Copy probe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => void sendYorkie(),
						children: "Download file"
					})]
				}),
				yorkieHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-warn",
					children: yorkieHint
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "yorkie-source",
					ref: sourceRef,
					readOnly: true,
					value: yorkieHtml,
					onFocus: (e) => e.currentTarget.select(),
					onClick: (e) => e.currentTarget.select(),
					className: "mt-4 h-40 w-full resize-y rounded-lg bg-bg p-3 font-mono text-xs text-fg shadow-border"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFlow, {
			targetName: machine.name,
			skipSymptoms: true,
			presetTelemetry: machine.telemetry,
			againLabel: "Probe again"
		}, machine.id)
	] });
}
//#endregion
export { LabPage as component };
