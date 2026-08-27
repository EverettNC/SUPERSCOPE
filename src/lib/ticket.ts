import type { Diagnosis, Telemetry } from "./types";

export type ProbeTicket = {
  v: 1;
  code: string;
  telemetry: Telemetry;
  diagnosis: Diagnosis;
};

export function encodeTicket(ticket: ProbeTicket): string {
  const json = JSON.stringify(ticket);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return `SCOPE1.${btoa(bin)}`;
}

export function decodeTicket(raw: string): ProbeTicket | null {
  const match = raw.trim().match(/SCOPE1\.([A-Za-z0-9+/=\s]+)/);
  if (!match?.[1]) return null;
  try {
    const bin = atob(match[1].replace(/\s/g, ""));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const ticket = JSON.parse(json) as ProbeTicket;
    if (ticket?.v !== 1 || !ticket.code || !ticket.diagnosis || !ticket.telemetry) {
      return null;
    }
    return ticket;
  } catch {
    return null;
  }
}
