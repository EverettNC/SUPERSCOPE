import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowRight, i as Laptop, n as Send, r as Radar } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, r as Shell } from "./createSsrRpc-CRUGmq6G.mjs";
import { a as selectInput, n as copyFromElement, r as copyText, s as useReports, t as ReportView } from "./store-CrYC-xFx.mjs";
import { a as normalizeCode } from "./probes-CctW0Goc.mjs";
import { t as LAB } from "./lab-C9vQJwYa.mjs";
import { r as saveProbeFile, t as buildProbeHtml } from "./probe-file-D8XxSXQ3.mjs";
import { t as decodeTicket } from "./ticket-YtWXqW9M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BF-G5gOX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-lg bg-surface px-3 text-sm text-fg shadow-border placeholder:text-subtle", "transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50", className),
		...props
	});
}
function Home() {
	const navigate = useNavigate();
	const reports = useReports((s) => s.reports);
	const addReport = useReports((s) => s.addReport);
	const [code, setCode] = (0, import_react.useState)("");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [paste, setPaste] = (0, import_react.useState)("");
	const [pasteError, setPasteError] = (0, import_react.useState)(null);
	const [pastedReport, setPastedReport] = (0, import_react.useState)(null);
	const yorkieHtml = (0, import_react.useMemo)(() => buildProbeHtml("YRK1-HELP"), []);
	const yorkieRef = (0, import_react.useRef)(null);
	const [yorkieHint, setYorkieHint] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setHydrated(true);
	}, []);
	function join(e) {
		e.preventDefault();
		const next = normalizeCode(code);
		if (next.replace(/[^A-Z0-9]/g, "").length !== 8) return;
		navigate({
			to: "/join/$code",
			params: { code: next }
		});
	}
	async function copyYorkie() {
		if (copyFromElement(yorkieRef.current)) {
			setYorkieHint("Copied. Paste into Notepad, Save As yorkie-probe.html, send her that file.");
			return;
		}
		const ok = await copyText(yorkieHtml);
		selectInput(yorkieRef.current);
		setYorkieHint(ok ? "Copied. Paste into Notepad, Save As yorkie-probe.html, send her that file." : "The probe is selected. Copy it, paste into Notepad, Save As yorkie-probe.html.");
	}
	async function downloadYorkie() {
		const result = await saveProbeFile("YRK1-HELP", "yorkie-probe.html");
		selectInput(yorkieRef.current);
		if (result.saved) setYorkieHint("Saved. Send her yorkie-probe.html.");
		else if (result.copied) setYorkieHint("Copied. Paste into Notepad, Save As yorkie-probe.html, send her that file.");
		else setYorkieHint("The probe is selected below. Copy it. Do not send a Grok link.");
	}
	function loadPaste() {
		setPasteError(null);
		const ticket = decodeTicket(paste);
		if (!ticket) {
			setPasteError("That isn't a Scope report. Ask her to tap Copy report and send the whole thing.");
			return;
		}
		const report = {
			id: ticket.code || "paste",
			targetName: ticket.telemetry.deviceName || "Remote computer",
			createdAt: ticket.telemetry.capturedAt,
			diagnosis: ticket.diagnosis,
			telemetry: ticket.telemetry,
			symptom: null,
			probeCode: ticket.code
		};
		addReport(report);
		setPastedReport(report);
	}
	if (pastedReport) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, { report: pastedReport }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-5xl pt-6 sm:pt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.2em] text-muted uppercase",
					children: "Field diagnostics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-4 max-w-xl font-display text-4xl leading-[1.05] text-fg sm:text-5xl",
					children: [
						"Send a file.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Not a Grok link."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-base text-muted",
					children: "Anyone you send this preview to will be asked for a Grok account. Send the HTML file instead. They open it, tap Allow. No login."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 rounded-xl bg-surface p-5 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
							children: "Yorkie’s probe — ready"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl text-fg",
							children: "Send her the file. Not a link."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-lg text-sm text-muted",
							children: "Download yorkie-probe.html and text her that file. She opens it, taps Allow. No Grok. No login. If download is blocked here, copy the probe and paste it into Notepad, then Save As yorkie-probe.html."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => void downloadYorkie(),
								children: "Download yorkie-probe.html"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: () => void copyYorkie(),
								children: "Copy probe"
							})]
						}),
						yorkieHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-warn",
							children: yorkieHint
						}) : null,
						yorkieHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: yorkieRef,
							readOnly: true,
							value: yorkieHtml,
							onFocus: (e) => e.currentTarget.select(),
							onClick: (e) => e.currentTarget.select(),
							className: "mt-4 h-28 w-full resize-y rounded-lg bg-bg p-3 font-mono text-xs text-fg shadow-border",
							"aria-label": "Yorkie probe HTML"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: yorkieRef,
							readOnly: true,
							value: yorkieHtml,
							className: "sr-only",
							"aria-hidden": "true",
							tabIndex: -1
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/scan",
						className: "group flex min-h-32 flex-col justify-between rounded-xl bg-primary p-5 text-primary-fg transition-transform duration-[var(--motion-quick)] ease-[var(--ease-out)] motion-safe:active:scale-[0.99]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
							className: "size-5",
							strokeWidth: 1.6
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-medium",
							children: "Scan this computer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm opacity-70",
							children: "Run a live probe on the device you are on."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/send",
						className: "group flex min-h-32 flex-col justify-between rounded-xl bg-surface p-5 text-fg shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							className: "size-5 text-muted",
							strokeWidth: 1.6
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-medium",
							children: "Send a probe"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: "Make a file for someone else. No Grok account."
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: join,
					className: "mt-4 flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-border sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "shrink-0 text-sm text-muted",
							htmlFor: "join-code",
							children: "Scan this computer with a code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "join-code",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "K7M4-Q2NX",
							autoCapitalize: "characters",
							autoCorrect: "off",
							spellCheck: false,
							className: "font-mono tracking-[0.18em] sm:max-w-48"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							className: "sm:ml-auto",
							children: "Open probe"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl bg-surface p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "home-paste",
							className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
							children: "Paste the report they send back"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "home-paste",
							value: paste,
							onChange: (e) => setPaste(e.target.value),
							placeholder: "SCOPE1.…",
							rows: 4,
							className: "mt-2 w-full resize-y rounded-lg bg-bg p-3 font-mono text-xs text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
						}),
						pasteError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-crit",
							children: pasteError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							className: "mt-3",
							onClick: loadPaste,
							disabled: !paste.trim(),
							children: "Load report"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-20 max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-fg",
					children: "The lab"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-md text-sm text-muted",
					children: "Seven machines with real problems. Start with Yorkie."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
					className: "hidden size-5 text-muted sm:block",
					strokeWidth: 1.6
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: LAB.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/lab/$id",
					params: { id: m.id },
					className: "flex min-h-40 flex-col justify-between rounded-xl bg-surface p-4 shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-fg",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 font-mono text-[11px] tracking-wide text-subtle uppercase",
							children: [
								m.place,
								" · ",
								m.os
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-lg leading-snug text-fg",
							children: [
								"“",
								m.quote,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-4 inline-flex items-center gap-1 text-sm text-muted",
							children: ["Send probe", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "size-3.5",
								strokeWidth: 1.75
							})]
						})
					]
				}, m.id))
			})]
		}),
		hydrated && reports.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto mt-20 max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-fg",
				children: "Recent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border",
				children: reports.slice(0, 6).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium text-fg",
							children: r.targetName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-muted",
							children: r.diagnosis.headline
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 font-mono text-sm tabular-nums text-muted",
						children: r.diagnosis.score
					})]
				}, r.id))
			})]
		}) : null
	] });
}
//#endregion
export { Home as component };
