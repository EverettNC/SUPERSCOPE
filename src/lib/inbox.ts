import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Report } from "./types";

const LIST =
  "https://webhook.site/token/6be3d5b5-949d-4839-b8a6-446582e7bc58/requests?sorting=newest&per_page=12";

type InboxTicket = {
  code?: string;
  telemetry?: Report["telemetry"];
  diagnosis?: Report["diagnosis"];
};

export function ticketToReport(ticket: InboxTicket): Report | null {
  if (!ticket.diagnosis || !ticket.telemetry) return null;
  const code = ticket.code || "YRK1-HELP";
  return {
    id: code,
    targetName: ticket.telemetry.deviceName || "Remote computer",
    createdAt: ticket.telemetry.capturedAt,
    diagnosis: ticket.diagnosis,
    telemetry: ticket.telemetry,
    symptom: null,
    probeCode: code,
  };
}

function compactCode(raw: string): string {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export const pullInbox = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const wanted = compactCode(data.code);
    const listed = await fetch(LIST, { headers: { Accept: "application/json" } });
    if (!listed.ok) return { ok: false as const, report: null };
    const payload = (await listed.json()) as { data?: Array<{ content?: string }> };
    const rows = Array.isArray(payload.data) ? payload.data : [];
    for (const row of rows) {
      try {
        const parsed = JSON.parse(String(row.content || "")) as InboxTicket;
        if (!parsed?.diagnosis || !parsed?.telemetry) continue;
        const code = compactCode(parsed.code || "");
        if (wanted && code && code !== wanted) continue;
        const report = ticketToReport(parsed);
        if (report) return { ok: true as const, report };
      } catch {
        /* skip junk */
      }
    }
    return { ok: true as const, report: null };
  });

export async function fetchInboxReport(code = "YRK1-HELP"): Promise<Report | null> {
  const res = await pullInbox({ data: { code } });
  return res.report;
}
