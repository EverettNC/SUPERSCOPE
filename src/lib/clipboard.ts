/** Copy text in iframes where Clipboard API is blocked (Grok preview, etc.). */

function copyWithExecCommand(text: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.setAttribute("aria-hidden", "true");
  el.tabIndex = -1;
  el.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0.01;pointer-events:none;";
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

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  if (copyWithExecCommand(text)) return true;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function selectInput(el: HTMLInputElement | HTMLTextAreaElement | null): boolean {
  if (!el) return false;
  el.focus();
  el.select();
  el.setSelectionRange(0, el.value.length);
  return true;
}

export function copyFromElement(el: HTMLInputElement | HTMLTextAreaElement | null): boolean {
  if (!selectInput(el)) return false;
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  }
}

/** Origins that demand a Grok account before the page even loads. Never send these. */
export function isGatedShareOrigin(origin: string): boolean {
  try {
    const url = new URL(origin.includes("://") ? origin : `https://${origin}`);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
    if (host === "grok.com" || host.endsWith(".grok.com")) return true;
    if (host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com")) return true;
    if (host.includes(".preview.")) return true;
    return false;
  } catch {
    return true;
  }
}

export const PUBLIC_PROBE_URL = "https://yorkie-probe.vercel.app";

export function publicProbeUrl(_code?: string): string {
  return PUBLIC_PROBE_URL;
}

function publicHost(): string {
  const raw = String(import.meta.env.VITE_PUBLIC_HOSTNAME ?? "").trim();
  if (!raw) return "";
  try {
    const host = raw.includes("://") ? new URL(raw).host : raw.replace(/\/$/, "");
    if (!host || isGatedShareOrigin(`https://${host}`)) return "";
    return host;
  } catch {
    return "";
  }
}

export function shareUrlFor(path: string): string | null {
  const host = publicHost();
  if (host) return `https://${host}${path.startsWith("/") ? path : `/${path}`}`;
  if (typeof window === "undefined") return null;
  const origin = window.location.origin;
  if (!origin || origin === "null" || isGatedShareOrigin(origin)) return null;
  try {
    return new URL(path, window.location.href).toString();
  } catch {
    return null;
  }
}

export function sendInstructions(code: string): string {
  const url = publicProbeUrl(code);
  return [
    `Open this on the computer that's acting up:`,
    url,
    ``,
    `If it's already open, refresh once.`,
    `Tap Allow. That's it. The report comes back on its own.`,
  ].join("\n");
}
