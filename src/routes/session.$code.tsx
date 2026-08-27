import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BackLink, Shell } from "@/components/shell";
import { Reticle } from "@/components/reticle";
import { ReportView } from "@/components/report";
import { Button } from "@/components/ui/button";
import { copyText, selectInput, sendInstructions } from "@/lib/clipboard";
import { buildProbeHtml, probeFileName, saveProbeFile } from "@/lib/probe-file";
import { completeProbe, getProbe, type ProbeRow } from "@/lib/probes";
import { decodeTicket } from "@/lib/ticket";
import { useReports } from "@/lib/store";
import type { Report } from "@/lib/types";

export const Route = createFileRoute("/session/$code")({ component: SessionPage });

function SessionPage() {
  const { code } = Route.useParams();
  const addReport = useReports((s) => s.addReport);
  const [probe, setProbe] = useState<ProbeRow | null>(null);
  const [copied, setCopied] = useState<"idle" | "html" | "file" | "note" | "select">("idle");
  const [saved, setSaved] = useState(false);
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pastedReport, setPastedReport] = useState<Report | null>(null);
  const [showSource, setShowSource] = useState(false);
  const copyTimer = useRef<number>(0);
  const html = buildProbeHtml(code);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      try {
        const res = await getProbe({ data: { code } });
        if (cancelled) return;
        if (res.ok) {
          setProbe(res.probe);
          if (res.probe.status !== "complete") {
            timer = window.setTimeout(() => void tick(), 1600);
          }
          return;
        }
        timer = window.setTimeout(() => void tick(), 4000);
      } catch {
        if (!cancelled) timer = window.setTimeout(() => void tick(), 4000);
      }
    }

    void tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, [code]);

  useEffect(() => {
    if (saved) return;
    if (probe?.status === "complete" && probe.diagnosis && probe.telemetry) {
      addReport({
        id: probe.code,
        targetName: probe.telemetry.deviceName || "Remote computer",
        createdAt: probe.createdAt,
        diagnosis: probe.diagnosis,
        telemetry: probe.telemetry,
        symptom: null,
        probeCode: probe.code,
      });
      setSaved(true);
    }
  }, [addReport, probe, saved]);

  function flash(kind: "html" | "file" | "note" | "select") {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    setCopied(kind);
    copyTimer.current = window.setTimeout(() => setCopied("idle"), 2400);
  }

  async function sendFile() {
    const result = await saveProbeFile(code);
    setShowSource(true);
    requestAnimationFrame(() => {
      selectInput(document.getElementById("probe-source") as HTMLTextAreaElement | null);
    });
    if (result.saved) flash("file");
    else if (result.copied) flash("html");
    else flash("select");
  }

  async function copyHtml() {
    const ok = await copyText(html);
    if (ok) {
      flash("html");
      return;
    }
    setShowSource(true);
    requestAnimationFrame(() => {
      selectInput(document.getElementById("probe-source") as HTMLTextAreaElement | null);
    });
    flash("select");
  }

  async function copyNote() {
    const ok = await copyText(sendInstructions(code));
    if (ok) flash("note");
  }

  async function loadPaste() {
    setPasteError(null);
    const ticket = decodeTicket(paste);
    if (!ticket) {
      setPasteError("That isn't a Scope report. Ask them to tap Copy report and send the whole thing.");
      return;
    }
    try {
      await completeProbe({
        data: {
          code,
          telemetry: ticket.telemetry,
          diagnosis: ticket.diagnosis,
        },
      });
    } catch {
      /* local paste still counts */
    }
    const report: Report = {
      id: ticket.code || code,
      targetName: ticket.telemetry.deviceName || "Remote computer",
      createdAt: ticket.telemetry.capturedAt,
      diagnosis: ticket.diagnosis,
      telemetry: ticket.telemetry,
      symptom: null,
      probeCode: code,
    };
    addReport(report);
    setPastedReport(report);
    setSaved(true);
  }

  const finished =
    pastedReport ||
    (probe?.status === "complete" && probe.diagnosis && probe.telemetry
      ? ({
          id: probe.code,
          targetName: probe.telemetry.deviceName || "Remote computer",
          createdAt: probe.createdAt,
          diagnosis: probe.diagnosis,
          telemetry: probe.telemetry,
          symptom: null,
          probeCode: probe.code,
        } satisfies Report)
      : null);

  if (finished) {
    return (
      <Shell>
        <BackLink />
        <ReportView report={finished} />
      </Shell>
    );
  }

  const waiting = !probe || probe.status === "waiting";

  return (
    <Shell>
      <BackLink />
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
        <Reticle progress={waiting ? 8 : 48} live />
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            {waiting ? "Dispatch" : "Probe is running"}
          </p>
          <h1 className="mt-2 font-display text-3xl text-fg sm:text-4xl">
            {waiting ? "Send the file. Not this window." : "Reading the machine."}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-warn">
            This preview is locked. Anyone you send it to will be told they do
            not have access. Do not share this page.
          </p>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Copy the probe, paste it into Notepad or Notes, save as{" "}
            <span className="font-mono text-fg">{probeFileName(code)}</span>, and
            send that file. They open it and tap Allow. No Grok account.
          </p>
          <p className="mt-8 font-mono text-4xl tracking-[0.18em] text-fg">{code}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button type="button" onClick={() => void copyHtml()}>
              {copied === "html"
                ? "Copied — paste into a .html file"
                : copied === "select"
                  ? "Selected — copy it"
                  : "Copy probe"}
            </Button>
            <Button type="button" variant="secondary" onClick={sendFile}>
              {copied === "file" ? "Saved — send that file" : "Download file"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => void copyNote()}>
              {copied === "note" ? "Copied" : "Copy instructions"}
            </Button>
          </div>

          {showSource ? (
            <textarea
              id="probe-source"
              readOnly
              value={html}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className="mt-4 h-32 w-full resize-y rounded-lg bg-surface p-3 font-mono text-xs text-fg shadow-border"
            />
          ) : null}

          <div className="mt-10">
            <label htmlFor="paste-report" className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
              Paste the report they send back
            </label>
            <textarea
              id="paste-report"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="SCOPE1.…"
              rows={5}
              className="mt-2 w-full resize-y rounded-lg bg-surface p-3 font-mono text-xs text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            {pasteError ? <p className="mt-2 text-sm text-crit">{pasteError}</p> : null}
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={() => void loadPaste()}
              disabled={!paste.trim()}
            >
              Load report
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
