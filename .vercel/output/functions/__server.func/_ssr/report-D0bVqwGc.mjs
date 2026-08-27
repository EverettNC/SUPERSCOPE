import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, t as array } from "../_libs/zod.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as createSsrRpc, i as cn, n as Button } from "./createSsrRpc-CRUGmq6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-D0bVqwGc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
}).parse(input)).handler(createSsrRpc("68489e16806542c3c73497dcb02152f227fede0adf65d4b056613611ad619793"));
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
function sendInstructions(code) {
	return [
		`I'm sending you a Scope probe (scope-probe-${code}.html).`,
		``,
		`Open that file on the computer that's acting up. Tap Allow.`,
		`No account. No login. Nothing installs.`,
		``,
		`When it finishes, tap Copy report and send that text back to me.`
	].join("\n");
}
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
function ReportView({ report, onAgain, againLabel = "Run another probe" }) {
	const { diagnosis, telemetry } = report;
	const [plain, setPlain] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [aiError, setAiError] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function ask() {
		if (busy) return;
		setBusy(true);
		setAiError(null);
		const res = await explainDiagnosis({ data: {
			headline: diagnosis.headline,
			summary: diagnosis.summary,
			findings: diagnosis.findings.slice(0, 8).map((f) => ({
				severity: f.severity,
				title: f.title,
				detail: f.detail
			})),
			symptom: report.symptom,
			device: telemetry.deviceName
		} });
		setBusy(false);
		if (!res.ok) {
			setAiError(res.error);
			return;
		}
		setPlain(res.text);
	}
	async function copySummary() {
		const ok = await copyText([
			`SCOPE · ${report.targetName}`,
			`${diagnosis.score} ${STATUS_LABEL[diagnosis.status].toUpperCase()}`,
			diagnosis.headline,
			diagnosis.summary,
			"",
			...diagnosis.findings.map((f) => `[${f.severity}] ${f.area} — ${f.title}`),
			"",
			"Fix:",
			...diagnosis.fixes.flatMap((fix, i) => [`${i + 1}. ${fix.title}`, ...fix.steps.map((s) => `   · ${s}`)])
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Plain English"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg",
					children: plain
				})]
			}) : null,
			aiError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-crit",
				children: aiError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void ask(),
						disabled: busy,
						className: "min-h-11",
						children: busy ? "Writing…" : plain ? "Rewrite" : "Explain in plain English"
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
//#endregion
export { sendInstructions as i, Reticle as n, copyText as r, ReportView as t };
