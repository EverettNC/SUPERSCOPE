import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Laptop, Radar, Send } from "lucide-react";
import { Shell } from "@/components/shell";
import { ReportView } from "@/components/report";
import { Reticle } from "@/components/reticle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyFromElement, copyText, PUBLIC_PROBE_URL, selectInput } from "@/lib/clipboard";
import { fetchInboxReport } from "@/lib/inbox";
import { YORKIE_CAUGHT } from "@/lib/yorkie-caught";
import { LAB } from "@/lib/lab";
import { normalizeCode } from "@/lib/probes";
import { useReports } from "@/lib/store";
import { decodeTicket } from "@/lib/ticket";
import type { Report } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const reports = useReports((s) => s.reports);
  const addReport = useReports((s) => s.addReport);
  const [code, setCode] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pastedReport, setPastedReport] = useState<Report | null>(YORKIE_CAUGHT);
  const linkRef = useRef<HTMLInputElement>(null);
  const [yorkieHint, setYorkieHint] = useState<string | null>(null);
  const [ticks, setTicks] = useState(8);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    async function tick() {
      try {
        const report = await fetchInboxReport("YRK1-HELP");
        if (cancelled) return;
        if (report) {
          addReport(report);
          setPastedReport(report);
          return;
        }
      } catch {
        /* keep listening */
      }
      if (!cancelled) {
        setTicks((n) => (n >= 92 ? 14 : n + 3));
        timer = window.setTimeout(() => void tick(), 1600);
      }
    }
    void tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [addReport]);

  function join(e: FormEvent) {
    e.preventDefault();
    const next = normalizeCode(code);
    if (next.replace(/[^A-Z0-9]/g, "").length !== 8) return;
    void navigate({ to: "/join/$code", params: { code: next } });
  }

  async function copyYorkieLink() {
    if (copyFromElement(linkRef.current)) {
      setYorkieHint("Copied. Text her that link. She taps it, then Allow.");
      return;
    }
    const ok = await copyText(PUBLIC_PROBE_URL);
    selectInput(linkRef.current);
    setYorkieHint(
      ok
        ? "Copied. Text her that link. She taps it, then Allow."
        : "The link is selected. Copy it and text it to her.",
    );
  }

  function loadPaste() {
    setPasteError(null);
    const ticket = decodeTicket(paste);
    if (!ticket) {
      setPasteError("That isn't a Scope report. Ask her to tap Copy report and send the whole thing.");
      return;
    }
    const report: Report = {
      id: ticket.code || "paste",
      targetName: ticket.telemetry.deviceName || "Remote computer",
      createdAt: ticket.telemetry.capturedAt,
      diagnosis: ticket.diagnosis,
      telemetry: ticket.telemetry,
      symptom: null,
      probeCode: ticket.code,
    };
    addReport(report);
    setPastedReport(report);
  }

  if (pastedReport) {
    return (
      <Shell>
        <ReportView report={pastedReport} />
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="mx-auto max-w-5xl pt-6 sm:pt-10">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Field diagnostics
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-fg sm:text-5xl">
          Waiting on her machine.
        </h1>
        <p className="mt-5 max-w-md text-base text-muted">
          Text her: refresh the page, then tap Allow. The report lands here.
          You do not copy anything. She does not log in.
        </p>

        <div className="mt-10 rounded-xl bg-surface p-5 shadow-border">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            Yorkie’s probe — listening
          </p>
          <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Reticle progress={ticks} live />
            <div className="min-w-0">
              <h2 className="font-display text-2xl text-fg">
                She taps Allow. That’s it.
              </h2>
              <p className="mt-2 max-w-lg text-sm text-muted">
                If the page is already open, she needs to refresh once so the
                new probe can send the report back by itself.
              </p>
              <label htmlFor="yorkie-link" className="sr-only">
                Yorkie’s probe link
              </label>
              <input
                id="yorkie-link"
                ref={linkRef}
                readOnly
                value={PUBLIC_PROBE_URL}
                onFocus={(e) => e.currentTarget.select()}
                onClick={(e) => e.currentTarget.select()}
                className="mt-4 h-11 w-full rounded-lg bg-bg px-3 font-mono text-sm text-fg shadow-border"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={() => void copyYorkieLink()}>
                  Copy link
                </Button>
                <Button type="button" variant="secondary" asChild>
                  <a href={PUBLIC_PROBE_URL} target="_blank" rel="noreferrer">
                    Open the probe
                  </a>
                </Button>
              </div>
              {yorkieHint ? <p className="mt-3 text-sm text-ok">{yorkieHint}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            to="/scan"
            className="group flex min-h-32 flex-col justify-between rounded-xl bg-primary p-5 text-primary-fg transition-transform duration-[var(--motion-quick)] ease-[var(--ease-out)] motion-safe:active:scale-[0.99]"
          >
            <Laptop className="size-5" strokeWidth={1.6} />
            <span>
              <span className="block text-base font-medium">Scan this computer</span>
              <span className="mt-1 block text-sm opacity-70">
                Run a live probe on the device you are on.
              </span>
            </span>
          </Link>
          <Link
            to="/send"
            className="group flex min-h-32 flex-col justify-between rounded-xl bg-surface p-5 text-fg shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover"
          >
            <Send className="size-5 text-muted" strokeWidth={1.6} />
            <span>
              <span className="block text-base font-medium">Send a probe</span>
              <span className="mt-1 block text-sm text-muted">
                Copy the same link. She taps Allow. No Grok account.
              </span>
            </span>
          </Link>
        </div>

        <form
          onSubmit={join}
          className="mt-4 flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-border sm:flex-row sm:items-center"
        >
          <label className="shrink-0 text-sm text-muted" htmlFor="join-code">
            Scan this computer with a code
          </label>
          <Input
            id="join-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="K7M4-Q2NX"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="font-mono tracking-[0.18em] sm:max-w-48"
          />
          <Button type="submit" variant="secondary" className="sm:ml-auto">
            Open probe
          </Button>
        </form>

        <div className="mt-4 rounded-xl bg-surface p-4 shadow-border">
          <label htmlFor="home-paste" className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            Paste the report they send back
          </label>
          <textarea
            id="home-paste"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="SCOPE1.…"
            rows={4}
            className="mt-2 w-full resize-y rounded-lg bg-bg p-3 font-mono text-xs text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          {pasteError ? <p className="mt-2 text-sm text-crit">{pasteError}</p> : null}
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={loadPaste}
            disabled={!paste.trim()}
          >
            Load report
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-fg">The lab</h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              Seven machines with real problems. Start with Yorkie.
            </p>
          </div>
          <Radar className="hidden size-5 text-muted sm:block" strokeWidth={1.6} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LAB.map((m) => (
            <Link
              key={m.id}
              to="/lab/$id"
              params={{ id: m.id }}
              className="flex min-h-40 flex-col justify-between rounded-xl bg-surface p-4 shadow-border transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-border-hover"
            >
              <div>
                <p className="text-sm font-medium text-fg">{m.name}</p>
                <p className="mt-0.5 font-mono text-[11px] tracking-wide text-subtle uppercase">
                  {m.place} · {m.os}
                </p>
              </div>
              <p className="mt-4 font-display text-lg leading-snug text-fg">
                “{m.quote}”
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-muted">
                Send probe
                <ArrowRight className="size-3.5" strokeWidth={1.75} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {hydrated && reports.length > 0 ? (
        <section className="mx-auto mt-20 max-w-5xl">
          <h2 className="font-display text-2xl text-fg">Recent</h2>
          <ul className="mt-4 divide-y divide-border">
            {reports.slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{r.targetName}</p>
                  <p className="truncate text-sm text-muted">{r.diagnosis.headline}</p>
                </div>
                <span className="shrink-0 font-mono text-sm tabular-nums text-muted">
                  {r.diagnosis.score}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Shell>
  );
}