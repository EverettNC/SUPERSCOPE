import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowRight, i as Laptop, n as Send, r as Radar } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, r as Shell } from "./createSsrRpc-CRUGmq6G.mjs";
import { a as normalizeCode } from "./probes-CctW0Goc.mjs";
import { n as useReports } from "./store-BYOuz_lx.mjs";
import { t as LAB } from "./lab-C9vQJwYa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DDH-CCsw.js
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
	const [code, setCode] = (0, import_react.useState)("");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
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
						"Send a probe.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"See what is wrong."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-base text-muted",
					children: "Download a probe. They open it and tap Allow. No account, no login, nothing installs. You get a verdict in plain English."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-3 sm:grid-cols-2",
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
							children: "Download a file. They open it. No Grok account."
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
							children: "I was sent a code"
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
