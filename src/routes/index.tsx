import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Laptop, Radar, Send } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LAB } from "@/lib/lab";
import { normalizeCode } from "@/lib/probes";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const reports = useReports((s) => s.reports);
  const [code, setCode] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  function join(e: FormEvent) {
    e.preventDefault();
    const next = normalizeCode(code);
    if (next.replace(/[^A-Z0-9]/g, "").length !== 8) return;
    void navigate({ to: "/join/$code", params: { code: next } });
  }

  return (
    <Shell>
      <section className="mx-auto max-w-5xl pt-6 sm:pt-10">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Field diagnostics
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-fg sm:text-5xl">
          Send a probe.
          <br />
          See what is wrong.
        </h1>
        <p className="mt-5 max-w-md text-base text-muted">
          Download a probe. They open it and tap Allow. No account, no login,
          nothing installs. You get a verdict in plain English.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
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
                Download a file. They open it. No Grok account.
              </span>
            </span>
          </Link>
        </div>

        <form
          onSubmit={join}
          className="mt-4 flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-border sm:flex-row sm:items-center"
        >
          <label className="shrink-0 text-sm text-muted" htmlFor="join-code">
            I was sent a code
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
