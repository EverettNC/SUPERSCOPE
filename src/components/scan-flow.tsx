import { useEffect, useRef, useState } from "react";
import { Reticle } from "@/components/reticle";
import { ReportView } from "@/components/report";
import { Button } from "@/components/ui/button";
import { diagnose } from "@/lib/engine";
import { prefersReducedMotion, SCAN_STEPS, sleep } from "@/lib/scan-script";
import { collectLiveTelemetry } from "@/lib/telemetry";
import { newId, useReports } from "@/lib/store";
import type { Report, SymptomId, Telemetry } from "@/lib/types";
import { SYMPTOMS } from "@/lib/types";
import { cn } from "@/lib/cn";

type Phase = "symptoms" | "running" | "done";

export function ScanFlow({
  targetName,
  skipSymptoms = false,
  presetTelemetry,
  defaultSymptom = null,
  onComplete,
  againLabel,
}: {
  targetName: string;
  skipSymptoms?: boolean;
  presetTelemetry?: Telemetry;
  defaultSymptom?: SymptomId | null;
  onComplete?: (report: Report) => void | Promise<void>;
  againLabel?: string;
}) {
  const addReport = useReports((s) => s.addReport);
  const addReportRef = useRef(addReport);
  addReportRef.current = addReport;
  const [phase, setPhase] = useState<Phase>(skipSymptoms ? "running" : "symptoms");
  const [symptom, setSymptom] = useState<SymptomId | null>(defaultSymptom);
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [runId, setRunId] = useState(0);
  const seq = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const symptomRef = useRef(symptom);
  symptomRef.current = symptom;

  function reset() {
    setReport(null);
    setLogs([]);
    setStepIndex(0);
    setRunId((n) => n + 1);
    setPhase(skipSymptoms ? "running" : "symptoms");
  }

  useEffect(() => {
    if (phase !== "running") return;
    const my = (seq.current += 1);
    let cancelled = false;
    setLogs([]);
    setStepIndex(0);

    (async () => {
      const reduced = prefersReducedMotion();
      const delay = reduced ? 0 : 360;
      const lines: string[] = [];
      for (let i = 0; i < SCAN_STEPS.length; i += 1) {
        if (cancelled || seq.current !== my) return;
        setStepIndex(i);
        lines.push(SCAN_STEPS[i].log);
        setLogs([...lines]);
        await sleep(delay);
      }
      if (cancelled || seq.current !== my) return;
      const telemetry = presetTelemetry
        ? { ...presetTelemetry, capturedAt: new Date().toISOString() }
        : await collectLiveTelemetry();
      if (cancelled || seq.current !== my) return;
      const diagnosis = diagnose(telemetry, symptomRef.current);
      const next: Report = {
        id: newId(),
        targetName,
        createdAt: new Date().toISOString(),
        diagnosis,
        telemetry,
        symptom: symptomRef.current,
      };
      addReportRef.current(next);
      setReport(next);
      setStepIndex(SCAN_STEPS.length);
      setPhase("done");
      await onCompleteRef.current?.(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, runId, presetTelemetry, targetName]);

  if (phase === "symptoms") {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
          {targetName}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">
          What is going wrong?
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted">
          Pick the closest match. The probe still reads the machine — this just aims it.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SYMPTOMS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSymptom(s.id)}
              className={cn(
                "min-h-14 rounded-xl px-4 py-3 text-left shadow-border transition-[box-shadow,background-color] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                symptom === s.id ? "bg-elevated shadow-border-hover" : "bg-surface hover:shadow-border-hover",
              )}
            >
              <span className="block text-sm font-medium text-fg">{s.label}</span>
              <span className="block text-xs text-muted">{s.hint}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="min-h-12"
            onClick={() => setPhase("running")}
          >
            Send probe
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="min-h-12"
            onClick={() => {
              setSymptom(null);
              setPhase("running");
            }}
          >
            Skip — just scan
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "running") {
    const step = SCAN_STEPS[Math.min(stepIndex, SCAN_STEPS.length - 1)];
    const progress = ((stepIndex + 1) / SCAN_STEPS.length) * 100;
    return (
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
        <Reticle progress={progress} live />
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            {targetName}
          </p>
          <h1 className="mt-2 font-display text-3xl text-fg">{step.label}</h1>
          <ol className="mt-6 max-h-56 space-y-1 overflow-hidden font-mono text-xs text-muted">
            {logs.filter((line, i) => i === 0 || line !== logs[i - 1]).map((line, i, arr) => (
              <li
                key={`${line}-${i}`}
                className={i === arr.length - 1 ? "text-fg" : undefined}
              >
                <span className="mr-2 text-subtle">›</span>
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <ReportView report={report} onAgain={reset} againLabel={againLabel} />
  );
}
