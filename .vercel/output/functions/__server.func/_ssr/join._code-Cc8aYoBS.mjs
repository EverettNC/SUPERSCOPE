import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$2 } from "./router-BI16N8Ti.mjs";
import { n as Button, r as Shell, t as BackLink } from "./createSsrRpc-CRUGmq6G.mjs";
import { o as startProbe, r as getProbe, t as completeProbe } from "./probes-CctW0Goc.mjs";
import { t as ReportView } from "./report-D0bVqwGc.mjs";
import { t as ScanFlow } from "./scan-flow-v4Yjvbpw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join._code-Cc8aYoBS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	const { code } = Route$2.useParams();
	const [probe, setProbe] = (0, import_react.useState)(null);
	const [allowed, setAllowed] = (0, import_react.useState)(false);
	const [declined, setDeclined] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await getProbe({ data: { code } });
				if (cancelled) return;
				if (!res.ok) return;
				setProbe(res.probe);
				if (res.probe.status === "scanning" || res.probe.status === "complete") setAllowed(true);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [code]);
	const onComplete = (0, import_react.useCallback)(async (report) => {
		try {
			await completeProbe({ data: {
				code,
				telemetry: report.telemetry,
				diagnosis: report.diagnosis
			} });
		} catch {}
	}, [code]);
	async function allow() {
		try {
			const res = await startProbe({ data: { code } });
			if (res.ok) setProbe(res.probe);
		} catch {}
		setAllowed(true);
	}
	if (declined) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-fg",
			children: "Declined"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-md text-sm text-muted",
			children: "Nothing was collected. You can close this page."
		})
	] });
	if (probe?.status === "complete" && probe.diagnosis && probe.telemetry) {
		const report = {
			id: probe.code,
			targetName: probe.telemetry.deviceName || "This computer",
			createdAt: probe.createdAt,
			diagnosis: probe.diagnosis,
			telemetry: probe.telemetry,
			symptom: null,
			probeCode: probe.code
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, { report })] });
	}
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: ["Probe ", code]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl",
				children: "Someone wants to diagnose this computer."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Allowing runs a browser probe: CPU cores, memory hints, GPU name, network speed, and a storage estimate. It does not install software, read your files, see your passwords, or take control. You do not need an account."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "min-h-12",
					onClick: () => void allow(),
					children: "Allow scan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "ghost",
					className: "min-h-12",
					onClick: () => setDeclined(true),
					children: "Decline"
				})]
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFlow, {
		targetName: "This computer",
		skipSymptoms: true,
		onComplete,
		againLabel: "Scan again"
	})] });
}
//#endregion
export { JoinPage as component };
