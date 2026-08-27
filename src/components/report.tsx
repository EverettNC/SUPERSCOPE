import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { copyText } from "@/lib/clipboard";
import { playGrokAudio, stopSpeaking } from "@/lib/speak";
import { synthesize } from "@/lib/voice";
import type { Diagnosis, Finding, Report, Severity } from "@/lib/types";
import { cn } from "@/lib/cn";

const TONE: Record<Severity, "ok" | "warn" | "crit" | "info"> = {
  ok: "ok",
  warn: "warn",
  crit: "crit",
  info: "info",
};

const STATUS_LABEL: Record<Diagnosis["status"], string> = {
  healthy: "Healthy",
  fair: "Fair",
  poor: "Poor",
  critical: "Critical",
};

function statusTone(status: Diagnosis["status"]) {
  if (status === "healthy") return "ok" as const;
  if (status === "fair") return "info" as const;
  if (status === "poor") return "warn" as const;
  return "crit" as const;
}

function plainEnglish(report: Report): string {
  const { diagnosis, telemetry } = report;
  const trouble = diagnosis.findings.filter(
    (f) => f.severity === "crit" || f.severity === "warn",
  );
  const rest = diagnosis.findings.filter(
    (f) => f.severity !== "crit" && f.severity !== "warn",
  );
  const first = diagnosis.fixes[0];
  const parts: string[] = [];
  parts.push(
    `${telemetry.deviceName} scored ${diagnosis.score} — ${STATUS_LABEL[diagnosis.status].toLowerCase()}. ${diagnosis.headline} ${diagnosis.summary}`,
  );
  if (trouble.length) {
    parts.push(trouble.map((f) => `${f.title}. ${f.detail}`).join(" "));
  } else if (rest.length) {
    parts.push(rest[0].detail);
  }
  if (first) {
    parts.push(
      `What to do: ${first.steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`,
    );
  }
  return parts.join("\n\n");
}

function spokenEnglish(report: Report): string {
  return plainEnglish(report)
    .replace(/ — /g, ". ")
    .replace(/\n\n/g, " [pause] ")
    .slice(0, 1800);
}

const audioCache = new Map<string, { audio: string; type: string }>();

export function ReportView({
  report,
  onAgain,
  againLabel = "Run another probe",
}: {
  report: Report;
  onAgain?: () => void;
  againLabel?: string;
}) {
  const { diagnosis, telemetry } = report;
  const [plain, setPlain] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => () => stopSpeaking(), []);

  async function readAloud() {
    const script = plainEnglish(report);
    const spoken = spokenEnglish(report);
    setPlain(script);
    if (speaking || loadingVoice) {
      stopSpeaking();
      setSpeaking(false);
      setLoadingVoice(false);
      return;
    }
    setVoiceError(null);
    setLoadingVoice(true);
    try {
      let clip = audioCache.get(spoken);
      if (!clip) {
        const res = await synthesize({ data: { text: spoken } });
        if (!res.ok) {
          setVoiceError(res.error);
          setLoadingVoice(false);
          return;
        }
        clip = { audio: res.audio, type: res.type };
        audioCache.set(spoken, clip);
      }
      setLoadingVoice(false);
      setSpeaking(true);
      const ok = await playGrokAudio(clip.audio, clip.type, () => setSpeaking(false));
      if (!ok) {
        setSpeaking(false);
        setVoiceError("Unmute this computer and tap again.");
      }
    } catch {
      setLoadingVoice(false);
      setSpeaking(false);
      setVoiceError("Voice didn't come through. Tap again.");
    }
  }

  async function copySummary() {
    const script = plainEnglish(report);
    const lines = [
      `SCOPE · ${report.targetName}`,
      `${diagnosis.score} ${STATUS_LABEL[diagnosis.status].toUpperCase()}`,
      diagnosis.headline,
      diagnosis.summary,
      "",
      ...diagnosis.findings.map((f) => `[${f.severity}] ${f.area} — ${f.title}`),
      "",
      "Fix:",
      ...diagnosis.fixes.flatMap((fix, i) => [
        `${i + 1}. ${fix.title}`,
        ...fix.steps.map((s) => `   · ${s}`),
      ]),
      "",
      script,
    ];
    const ok = await copyText(lines.join("\n"));
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            {report.targetName}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-[1.15] text-fg sm:text-4xl">
            {diagnosis.headline}
          </h1>
        </div>
        <ScoreMark score={diagnosis.score} status={diagnosis.status} />
      </div>

      <p className="mt-6 max-w-2xl text-base text-muted">{diagnosis.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone={statusTone(diagnosis.status)}>
          {STATUS_LABEL[diagnosis.status]} · {diagnosis.primaryArea}
        </Badge>
        <Badge>
          {telemetry.os}
          {telemetry.osVersion ? ` ${telemetry.osVersion}` : ""}
        </Badge>
        {telemetry.gpu ? <Badge>{shortGpu(telemetry.gpu)}</Badge> : null}
        {telemetry.cpuCores ? <Badge>{telemetry.cpuCores} cores</Badge> : null}
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Findings</h2>
        <ul className="mt-4 divide-y divide-border">
          {diagnosis.findings.map((f) => (
            <FindingRow key={f.id} finding={f} />
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Fix this</h2>
        <ol className="mt-4 grid gap-3">
          {diagnosis.fixes.map((fix, i) => (
            <li
              key={fix.title}
              className="rounded-xl bg-surface p-4 shadow-border sm:p-5"
            >
              <p className="text-sm font-medium text-fg">
                <span className="mr-2 font-mono text-muted tabular-nums">{i + 1}</span>
                {fix.title}
              </p>
              <p className="mt-1 text-sm text-muted">{fix.why}</p>
              <ul className="mt-3 space-y-2">
                {fix.steps.map((step) => (
                  <li key={step} className="flex gap-2 text-sm text-fg">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {plain ? (
        <section className="mt-12 rounded-xl bg-surface p-5 shadow-border">
          <h2 className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            {speaking ? "Speaking" : "Read this to them"}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg">{plain}</p>
          <p className="mt-3 text-xs text-subtle">Unmute this computer. Tap again to stop.</p>
        </section>
      ) : null}

      {voiceError ? <p className="mt-4 text-sm text-warn">{voiceError}</p> : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => void readAloud()} className="min-h-11">
          {loadingVoice ? "Writing the voice…" : speaking ? "Stop reading" : "Read this aloud"}
        </Button>
        <Button variant="secondary" onClick={() => void copySummary()} className="min-h-11">
          {copied ? "Copied" : "Copy report"}
        </Button>
        {onAgain ? (
          <Button variant="ghost" onClick={onAgain} className="min-h-11">
            {againLabel}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function ScoreMark({
  score,
  status,
}: {
  score: number;
  status: Diagnosis["status"];
}) {
  return (
    <div className="flex shrink-0 items-baseline gap-3 whitespace-nowrap">
      <span className="font-display text-5xl leading-none tabular-nums text-fg">{score}</span>
      <span
        className={cn(
          "font-mono text-xs tracking-[0.16em] uppercase",
          status === "healthy" && "text-ok",
          status === "fair" && "text-muted",
          status === "poor" && "text-warn",
          status === "critical" && "text-crit",
        )}
      >
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <li className="flex gap-4 py-4">
      <Badge tone={TONE[finding.severity]} className="mt-0.5 h-fit shrink-0 capitalize">
        {finding.severity}
      </Badge>
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{finding.title}</p>
        <p className="mt-1 text-sm text-muted">{finding.detail}</p>
        <p className="mt-1 font-mono text-[11px] tracking-wide text-subtle uppercase">
          {finding.area}
        </p>
      </div>
    </li>
  );
}

function shortGpu(name: string): string {
  return name.replace(/ANGLE \(|Direct3D.+|OpenGL.+|\)$/g, "").trim().slice(0, 42);
}
