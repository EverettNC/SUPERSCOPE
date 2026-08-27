import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as createSsrRpc, i as cn, n as Button } from "./createSsrRpc-CRUGmq6G.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CrYC-xFx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		neutral: "bg-surface text-muted shadow-border",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn",
		crit: "bg-crit/15 text-crit",
		info: "bg-surface text-fg shadow-border"
	} },
	defaultVariants: { tone: "neutral" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
/** Copy text in iframes where Clipboard API is blocked (Grok preview, etc.). */
function copyWithExecCommand(text) {
	if (typeof document === "undefined") return false;
	const el = document.createElement("textarea");
	el.value = text;
	el.setAttribute("readonly", "");
	el.setAttribute("aria-hidden", "true");
	el.tabIndex = -1;
	el.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0.01;pointer-events:none;";
	document.body.appendChild(el);
	const ios = /ipad|iphone|ipod/i.test(navigator.userAgent);
	el.focus();
	if (ios) {
		const range = document.createRange();
		range.selectNodeContents(el);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
		el.setSelectionRange(0, text.length);
	} else {
		el.select();
		el.setSelectionRange(0, text.length);
	}
	let ok = false;
	try {
		ok = document.execCommand("copy");
	} catch {
		ok = false;
	}
	document.body.removeChild(el);
	return ok;
}
async function copyText(text) {
	if (!text) return false;
	if (copyWithExecCommand(text)) return true;
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
	return false;
}
function selectInput(el) {
	if (!el) return false;
	el.focus();
	el.select();
	el.setSelectionRange(0, el.value.length);
	return true;
}
function copyFromElement(el) {
	if (!selectInput(el)) return false;
	try {
		return document.execCommand("copy");
	} catch {
		return false;
	}
}
function sendInstructions(code) {
	return [
		`I'm sending you a Scope probe file: scope-probe-${code}.html`,
		``,
		`Open that file on the computer that's acting up. Tap Allow.`,
		`No account. No Grok login. Nothing installs.`,
		``,
		`When it finishes, tap Copy report and send that text back to me.`,
		``,
		`Do not open a Grok preview link. That page is locked. Use the file.`
	].join("\n");
}
var player = null;
var objectUrl = null;
function stopSpeaking() {
	if (player) {
		player.pause();
		player.src = "";
		player = null;
	}
	if (objectUrl) {
		URL.revokeObjectURL(objectUrl);
		objectUrl = null;
	}
}
async function playGrokAudio(base64, type, onEnd) {
	stopSpeaking();
	const bin = atob(base64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
	objectUrl = URL.createObjectURL(new Blob([bytes], { type: type || "audio/mpeg" }));
	const audio = new Audio(objectUrl);
	player = audio;
	audio.onended = () => {
		stopSpeaking();
		onEnd?.();
	};
	audio.onerror = () => {
		stopSpeaking();
		onEnd?.();
	};
	try {
		await audio.play();
		return true;
	} catch {
		stopSpeaking();
		onEnd?.();
		return false;
	}
}
var synthesize = createServerFn({ method: "POST" }).validator((input) => object({ text: string().min(1).max(2e3) }).parse(input)).handler(createSsrRpc("e0b42287816bcfd729f7de509177e8591b58a7891b72fc7f1291e23662aff5e2"));
var TONE = {
	ok: "ok",
	warn: "warn",
	crit: "crit",
	info: "info"
};
var STATUS_LABEL = {
	healthy: "Healthy",
	fair: "Fair",
	poor: "Poor",
	critical: "Critical"
};
function statusTone(status) {
	if (status === "healthy") return "ok";
	if (status === "fair") return "info";
	if (status === "poor") return "warn";
	return "crit";
}
function plainEnglish(report) {
	const { diagnosis, telemetry } = report;
	const trouble = diagnosis.findings.filter((f) => f.severity === "crit" || f.severity === "warn");
	const rest = diagnosis.findings.filter((f) => f.severity !== "crit" && f.severity !== "warn");
	const first = diagnosis.fixes[0];
	const parts = [];
	parts.push(`${telemetry.deviceName} scored ${diagnosis.score} — ${STATUS_LABEL[diagnosis.status].toLowerCase()}. ${diagnosis.headline} ${diagnosis.summary}`);
	if (trouble.length) parts.push(trouble.map((f) => `${f.title}. ${f.detail}`).join(" "));
	else if (rest.length) parts.push(rest[0].detail);
	if (first) parts.push(`What to do: ${first.steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`);
	return parts.join("\n\n");
}
function spokenEnglish(report) {
	return plainEnglish(report).replace(/ — /g, ". ").replace(/\n\n/g, " [pause] ").slice(0, 1800);
}
var audioCache = /* @__PURE__ */ new Map();
function ReportView({ report, onAgain, againLabel = "Run another probe" }) {
	const { diagnosis, telemetry } = report;
	const [plain, setPlain] = (0, import_react.useState)(null);
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const [loadingVoice, setLoadingVoice] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [voiceError, setVoiceError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => () => stopSpeaking(), []);
	async function readAloud() {
		const script = plainEnglish(report);
		const spoken = spokenEnglish(report);
		setPlain(script);
		if (speaking || loadingVoice) {
			stopSpeaking();
			setSpeaking(false);
			setLoadingVoice(false);
			return;
		}
		setVoiceError(null);
		setLoadingVoice(true);
		try {
			let clip = audioCache.get(spoken);
			if (!clip) {
				const res = await synthesize({ data: { text: spoken } });
				if (!res.ok) {
					setVoiceError(res.error);
					setLoadingVoice(false);
					return;
				}
				clip = {
					audio: res.audio,
					type: res.type
				};
				audioCache.set(spoken, clip);
			}
			setLoadingVoice(false);
			setSpeaking(true);
			if (!await playGrokAudio(clip.audio, clip.type, () => setSpeaking(false))) {
				setSpeaking(false);
				setVoiceError("Unmute this computer and tap again.");
			}
		} catch {
			setLoadingVoice(false);
			setSpeaking(false);
			setVoiceError("Voice didn't come through. Tap again.");
		}
	}
	async function copySummary() {
		const script = plainEnglish(report);
		const ok = await copyText([
			`SCOPE · ${report.targetName}`,
			`${diagnosis.score} ${STATUS_LABEL[diagnosis.status].toUpperCase()}`,
			diagnosis.headline,
			diagnosis.summary,
			"",
			...diagnosis.findings.map((f) => `[${f.severity}] ${f.area} — ${f.title}`),
			"",
			"Fix:",
			...diagnosis.fixes.flatMap((fix, i) => [`${i + 1}. ${fix.title}`, ...fix.steps.map((s) => `   · ${s}`)]),
			"",
			script
		].join("\n"));
		setCopied(ok);
		window.setTimeout(() => setCopied(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: report.targetName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl leading-[1.15] text-fg sm:text-4xl",
					children: diagnosis.headline
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreMark, {
					score: diagnosis.score,
					status: diagnosis.status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-base text-muted",
				children: diagnosis.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: statusTone(diagnosis.status),
						children: [
							STATUS_LABEL[diagnosis.status],
							" · ",
							diagnosis.primaryArea
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [telemetry.os, telemetry.osVersion ? ` ${telemetry.osVersion}` : ""] }),
					telemetry.gpu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: shortGpu(telemetry.gpu) }) : null,
					telemetry.cpuCores ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [telemetry.cpuCores, " cores"] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Findings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border",
					children: diagnosis.findings.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingRow, { finding: f }, f.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Fix this"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-3",
					children: diagnosis.fixes.map((fix, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-border sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-2 font-mono text-muted tabular-nums",
									children: i + 1
								}), fix.title]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: fix.why
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: fix.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
								}, step))
							})
						]
					}, fix.title))
				})]
			}),
			plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 rounded-xl bg-surface p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
						children: speaking ? "Speaking" : "Read this to them"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg",
						children: plain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-subtle",
						children: "Unmute this computer. Tap again to stop."
					})
				]
			}) : null,
			voiceError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-warn",
				children: voiceError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void readAloud(),
						className: "min-h-11",
						children: loadingVoice ? "Writing the voice…" : speaking ? "Stop reading" : "Read this aloud"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => void copySummary(),
						className: "min-h-11",
						children: copied ? "Copied" : "Copy report"
					}),
					onAgain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onAgain,
						className: "min-h-11",
						children: againLabel
					}) : null
				]
			})
		]
	});
}
function ScoreMark({ score, status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex shrink-0 items-baseline gap-3 whitespace-nowrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-5xl leading-none tabular-nums text-fg",
			children: score
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-mono text-xs tracking-[0.16em] uppercase", status === "healthy" && "text-ok", status === "fair" && "text-muted", status === "poor" && "text-warn", status === "critical" && "text-crit"),
			children: STATUS_LABEL[status]
		})]
	});
}
function FindingRow({ finding }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone: TONE[finding.severity],
			className: "mt-0.5 h-fit shrink-0 capitalize",
			children: finding.severity
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-fg",
					children: finding.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: finding.detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-[11px] tracking-wide text-subtle uppercase",
					children: finding.area
				})
			]
		})]
	});
}
function shortGpu(name) {
	return name.replace(/ANGLE \(|Direct3D.+|OpenGL.+|\)$/g, "").trim().slice(0, 42);
}
var useReports = create()(persist((set, get) => ({
	reports: [],
	addReport: (report) => {
		set({ reports: [report, ...get().reports.filter((r) => r.id !== report.id)].slice(0, 12) });
	}
}), { name: "scope-reports" }));
function newId() {
	return crypto.randomUUID();
}
//#endregion
export { selectInput as a, newId as i, copyFromElement as n, sendInstructions as o, copyText as r, useReports as s, ReportView as t };
