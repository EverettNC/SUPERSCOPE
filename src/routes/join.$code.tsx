import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { ScanFlow } from "@/components/scan-flow";
import { ReportView } from "@/components/report";
import { Button } from "@/components/ui/button";
import { completeProbe, getProbe, startProbe, type ProbeRow } from "@/lib/probes";
import type { Report } from "@/lib/types";

export const Route = createFileRoute("/join/$code")({ component: JoinPage });

function JoinPage() {
  const { code } = Route.useParams();
  const [probe, setProbe] = useState<ProbeRow | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getProbe({ data: { code } });
        if (cancelled) return;
        if (!res.ok) {
          // Still let them scan this machine. No account. No wall.
          return;
        }
        setProbe(res.probe);
        if (res.probe.status === "scanning" || res.probe.status === "complete") {
          setAllowed(true);
        }
      } catch {
        /* stay on Allow */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const onComplete = useCallback(
    async (report: Report) => {
      try {
        await completeProbe({
          data: {
            code,
            telemetry: report.telemetry,
            diagnosis: report.diagnosis,
          },
        });
      } catch {
        /* report still shows locally */
      }
    },
    [code],
  );

  async function allow() {
    try {
      const res = await startProbe({ data: { code } });
      if (res.ok) setProbe(res.probe);
    } catch {
      /* scan anyway */
    }
    setAllowed(true);
  }

  if (declined) {
    return (
      <Shell>
        <BackLink />
        <h1 className="font-display text-3xl text-fg">Declined</h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Nothing was collected. You can close this page.
        </p>
      </Shell>
    );
  }

  if (probe?.status === "complete" && probe.diagnosis && probe.telemetry) {
    const report: Report = {
      id: probe.code,
      targetName: probe.telemetry.deviceName || "This computer",
      createdAt: probe.createdAt,
      diagnosis: probe.diagnosis,
      telemetry: probe.telemetry,
      symptom: null,
      probeCode: probe.code,
    };
    return (
      <Shell>
        <BackLink />
        <ReportView report={report} />
      </Shell>
    );
  }

  if (!allowed) {
    return (
      <Shell>
        <BackLink />
        <div className="mx-auto max-w-lg">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            Probe {code}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">
            Someone wants to diagnose this computer.
          </h1>
          <p className="mt-4 text-sm text-muted">
            Allowing runs a browser probe: CPU cores, memory hints, GPU name,
            network speed, and a storage estimate. It does not install software,
            read your files, see your passwords, or take control. You do not
            need an account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="min-h-12" onClick={() => void allow()}>
              Allow scan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="min-h-12"
              onClick={() => setDeclined(true)}
            >
              Decline
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <BackLink />
      <ScanFlow
        targetName="This computer"
        skipSymptoms
        onComplete={onComplete}
        againLabel="Scan again"
      />
    </Shell>
  );
}
