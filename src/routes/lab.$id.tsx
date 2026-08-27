import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { ScanFlow } from "@/components/scan-flow";
import { getLab } from "@/lib/lab";
import { Button } from "@/components/ui/button";
import { copyFromElement, copyText, PUBLIC_PROBE_URL, selectInput } from "@/lib/clipboard";

export const Route = createFileRoute("/lab/$id")({ component: LabPage });

function LabPage() {
  const { id } = Route.useParams();
  const machine = getLab(id);
  const linkRef = useRef<HTMLInputElement>(null);
  const [yorkieHint, setYorkieHint] = useState<string | null>(null);

  if (!machine) {
    return (
      <Shell>
        <BackLink />
        <p className="text-sm text-muted">That machine is not in the lab.</p>
        <Button asChild className="mt-6">
          <Link to="/">Home</Link>
        </Button>
      </Shell>
    );
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

  return (
    <Shell>
      <BackLink label="The lab" />
      {machine.id === "yorkie" ? (
        <div className="mx-auto mb-8 max-w-3xl rounded-xl bg-surface p-5 shadow-border">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            For Yorkie — no Grok login
          </p>
          <p className="mt-2 text-sm text-fg">
            Text her this link. She taps it on the sick computer, then Allow.
            No account. Nothing installs.
          </p>
          <label htmlFor="yorkie-lab-link" className="sr-only">
            Yorkie’s probe link
          </label>
          <input
            id="yorkie-lab-link"
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
      ) : null}
      <ScanFlow
        key={machine.id}
        targetName={machine.name}
        skipSymptoms
        presetTelemetry={machine.telemetry}
        againLabel="Probe again"
      />
    </Shell>
  );
}