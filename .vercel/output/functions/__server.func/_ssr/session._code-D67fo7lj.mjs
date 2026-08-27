import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./router-CE-Hy2DG.mjs";
import { n as Button, r as Shell, t as BackLink } from "./createSsrRpc-CRUGmq6G.mjs";
import { a as selectInput, n as copyFromElement, o as sendInstructions, r as copyText, s as useReports, t as ReportView } from "./store-CrYC-xFx.mjs";
import { r as getProbe, t as completeProbe } from "./probes-CctW0Goc.mjs";
import { t as Reticle } from "./reticle-BGG377a4.mjs";
import { n as probeFileName, r as saveProbeFile, t as buildProbeHtml } from "./probe-file-D8XxSXQ3.mjs";
import { t as decodeTicket } from "./ticket-YtWXqW9M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session._code-D67fo7lj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionPage() {
	const { code } = Route.useParams();
	const addReport = useReports((s) => s.addReport);
	const [probe, setProbe] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)("idle");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [paste, setPaste] = (0, import_react.useState)("");
	const [pasteError, setPasteError] = (0, import_react.useState)(null);
	const [pastedReport, setPastedReport] = (0, import_react.useState)(null);
	const copyTimer = (0, import_react.useRef)(0);
	const sourceRef = (0, import_react.useRef)(null);
	const html = buildProbeHtml(code);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let timer;
		async function tick() {
			try {
				const res = await getProbe({ data: { code } });
				if (cancelled) return;
				if (res.ok) {
					setProbe(res.probe);
					if (res.probe.status !== "complete") timer = window.setTimeout(() => void tick(), 1600);
					return;
				}
				timer = window.setTimeout(() => void tick(), 4e3);
			} catch {
				if (!cancelled) timer = window.setTimeout(() => void tick(), 4e3);
			}
		}
		tick();
		return () => {
			cancelled = true;
			if (timer) window.clearTimeout(timer);
			if (copyTimer.current) window.clearTimeout(copyTimer.current);
		};
	}, [code]);
	(0, import_react.useEffect)(() => {
		selectInput(sourceRef.current);
	}, [html]);
	(0, import_react.useEffect)(() => {
		if (saved) return;
		if (probe?.status === "complete" && probe.diagnosis && probe.telemetry) {
			addReport({
				id: probe.code,
				targetName: probe.telemetry.deviceName || "Remote computer",
				createdAt: probe.createdAt,
				diagnosis: probe.diagnosis,
				telemetry: probe.telemetry,
				symptom: null,
				probeCode: probe.code
			});
			setSaved(true);
		}
	}, [
		addReport,
		probe,
		saved
	]);
	function flash(kind) {
		if (copyTimer.current) window.clearTimeout(copyTimer.current);
		setCopied(kind);
		copyTimer.current = window.setTimeout(() => setCopied("idle"), 2400);
	}
	async function sendFile() {
		const result = await saveProbeFile(code);
		requestAnimationFrame(() => {
			selectInput(sourceRef.current);
		});
		if (result.saved) flash("file");
		else if (result.copied) flash("html");
		else flash("select");
	}
	async function copyHtml() {
		if (copyFromElement(sourceRef.current)) {
			flash("html");
			return;
		}
		if (await copyText(html)) {
			flash("html");
			return;
		}
		selectInput(sourceRef.current);
		flash("select");
	}
	async function copyNote() {
		if (await copyText(sendInstructions(code))) flash("note");
	}
	async function loadPaste() {
		setPasteError(null);
		const ticket = decodeTicket(paste);
		if (!ticket) {
			setPasteError("That isn't a Scope report. Ask them to tap Copy report and send the whole thing.");
			return;
		}
		try {
			await completeProbe({ data: {
				code,
				telemetry: ticket.telemetry,
				diagnosis: ticket.diagnosis
			} });
		} catch {}
		const report = {
			id: ticket.code || code,
			targetName: ticket.telemetry.deviceName || "Remote computer",
			createdAt: ticket.telemetry.capturedAt,
			diagnosis: ticket.diagnosis,
			telemetry: ticket.telemetry,
			symptom: null,
			probeCode: code
		};
		addReport(report);
		setPastedReport(report);
		setSaved(true);
	}
	const finished = pastedReport || (probe?.status === "complete" && probe.diagnosis && probe.telemetry ? {
		id: probe.code,
		targetName: probe.telemetry.deviceName || "Remote computer",
		createdAt: probe.createdAt,
		diagnosis: probe.diagnosis,
		telemetry: probe.telemetry,
		symptom: null,
		probeCode: probe.code
	} : null);
	if (finished) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, { report: finished })] });
	const waiting = !probe || probe.status === "waiting";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-4xl gap-10 lg:grid-cols-[auto_1fr] lg:items-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reticle, {
			progress: waiting ? 8 : 48,
			live: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: waiting ? "Dispatch" : "Probe is running"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl text-fg sm:text-4xl",
				children: waiting ? "Send the file. Not this window." : "Reading the machine."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-lg text-sm text-warn",
				children: "This preview is locked. Anyone you send it to will be told they do not have access. Do not share this page."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-lg text-sm text-muted",
				children: [
					"Copy the probe, paste it into Notepad or Notes, save as",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-fg",
						children: probeFileName(code)
					}),
					", and send that file. They open it and tap Allow. No Grok account."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-mono text-4xl tracking-[0.18em] text-fg",
				children: code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void copyHtml(),
						children: copied === "html" ? "Copied — paste into a .html file" : copied === "select" ? "Selected — copy it" : "Copy probe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: sendFile,
						children: copied === "file" ? "Saved — send that file" : "Download file"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => void copyNote(),
						children: copied === "note" ? "Copied" : "Copy instructions"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "probe-source",
				ref: sourceRef,
				readOnly: true,
				value: html,
				onFocus: (e) => e.currentTarget.select(),
				onClick: (e) => e.currentTarget.select(),
				className: "mt-4 h-40 w-full resize-y rounded-lg bg-surface p-3 font-mono text-xs text-fg shadow-border"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "paste-report",
						className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
						children: "Paste the report they send back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "paste-report",
						value: paste,
						onChange: (e) => setPaste(e.target.value),
						placeholder: "SCOPE1.…",
						rows: 5,
						className: "mt-2 w-full resize-y rounded-lg bg-surface p-3 font-mono text-xs text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
					}),
					pasteError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-crit",
						children: pasteError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						className: "mt-3",
						onClick: () => void loadPaste(),
						disabled: !paste.trim(),
						children: "Load report"
					})
				]
			})
		] })]
	})] });
}
//#endregion
export { SessionPage as component };
