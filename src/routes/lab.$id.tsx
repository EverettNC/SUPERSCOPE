import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { ScanFlow } from "@/components/scan-flow";
import { getLab } from "@/lib/lab";
import { Button } from "@/components/ui/button";
import { saveProbeFile } from "@/lib/probe-file";
import { selectInput } from "@/lib/clipboard";

export const Route = createFileRoute("/lab/$id")({ component: LabPage });

function LabPage() {
  const { id } = Route.useParams();
  const machine = getLab(id);
  const [yorkieHtml, setYorkieHtml] = useState<string | null>(null);
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

  async function sendYorkie() {
    const result = await saveProbeFile("YRK1-HELP", "yorkie-probe.html");
    setYorkieHtml(result.html);
    if (result.saved) {
      setYorkieHint("Saved. Send her yorkie-probe.html.");
      return;
    }
    if (result.copied) {
      setYorkieHint(
        "This window cannot download files. The probe is copied. Open Notepad, paste, Save As yorkie-probe.html — then text her that file.",
      );
    } else {
      setYorkieHint(
        "Select the text below, copy it, paste into Notepad, Save As yorkie-probe.html, then send her that file.",
      );
    }
    requestAnimationFrame(() => {
      selectInput(document.getElementById("yorkie-source") as HTMLTextAreaElement | null);
    });
  }

  return (
    <Shell>
      <BackLink label="The lab" />
      {machine.id === "yorkie" ? (
        <div className="mx-auto mb-8 max-w-3xl rounded-xl bg-surface p-5 shadow-border">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            For Yorkie
          </p>
          <p className="mt-2 text-sm text-fg">
            This preview blocks downloads. Tap the button. If no file appears,
            paste into Notepad and save as yorkie-probe.html, then send her that
            file. She opens it, taps Allow, then Read this aloud.
          </p>
          <Button className="mt-4" onClick={() => void sendYorkie()}>
            Get Yorkie’s probe
          </Button>
          {yorkieHint ? <p className="mt-3 text-sm text-warn">{yorkieHint}</p> : null}
          {yorkieHtml ? (
            <textarea
              id="yorkie-source"
              readOnly
              value={yorkieHtml}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className="mt-4 h-36 w-full resize-y rounded-lg bg-bg p-3 font-mono text-xs text-fg shadow-border"
            />
          ) : null}
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