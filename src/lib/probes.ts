import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import type { Diagnosis, Telemetry } from "@/lib/types";

const CODE_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function mintCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let s = "";
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function normalizeCode(raw: string): string {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length !== 8) return raw.trim().toUpperCase();
  return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}

export type ProbeStatus = "waiting" | "scanning" | "complete";

export type ProbeRow = {
  code: string;
  status: ProbeStatus;
  createdAt: string;
  telemetry: Telemetry | null;
  diagnosis: Diagnosis | null;
};

type DbProbe = {
  code: string;
  status: string;
  created_at: string;
  telemetry: unknown;
  diagnosis: unknown;
};

function parseJson<T>(value: unknown): T | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as T;
  return null;
}

function toRow(row: DbProbe): ProbeRow {
  return {
    code: row.code,
    status: (row.status as ProbeStatus) || "waiting",
    createdAt: row.created_at,
    telemetry: parseJson<Telemetry>(row.telemetry),
    diagnosis: parseJson<Diagnosis>(row.diagnosis),
  };
}

export const createProbe = createServerFn({ method: "POST" }).handler(async () => {
  const sql = await getSql();
  for (let i = 0; i < 6; i += 1) {
    const code = mintCode();
    try {
      await sql.query("insert into probes (code, status) values ($1, $2)", [
        code,
        "waiting",
      ]);
      return { ok: true as const, code };
    } catch {
      /* collision — retry */
    }
  }
  return { ok: false as const, error: "Could not open a session." };
});

export const getProbe = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    if (!CODE_RE.test(code)) return { ok: false as const, error: "Bad code." };
    const sql = await getSql();
    const rows = await sql.query<DbProbe>(
      "select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1 and created_at > now() - interval '24 hours' limit 1",
      [code],
    );
    const row = rows[0];
    if (!row) return { ok: false as const, error: "No probe with that code." };
    return { ok: true as const, probe: toRow(row) };
  });

export const startProbe = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    if (!CODE_RE.test(code)) return { ok: false as const, error: "Bad code." };
    const sql = await getSql();
    const rows = await sql.query<{ code: string }>(
      "update probes set status = 'scanning', started_at = now() where code = $1 and status = 'waiting' returning code",
      [code],
    );
    if (!rows[0]) {
      const existing = await sql.query<DbProbe>(
        "select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1 limit 1",
        [code],
      );
      if (!existing[0]) return { ok: false as const, error: "No probe with that code." };
      return { ok: true as const, probe: toRow(existing[0]) };
    }
    const next = await sql.query<DbProbe>(
      "select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1",
      [code],
    );
    return { ok: true as const, probe: toRow(next[0]!) };
  });

export const completeProbe = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        code: z.string().min(1),
        telemetry: z.unknown(),
        diagnosis: z.unknown(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    if (!CODE_RE.test(code)) return { ok: false as const, error: "Bad code." };
    const sql = await getSql();
    const rows = await sql.query<DbProbe>(
      "update probes set status = 'complete', completed_at = now(), telemetry = $2::jsonb, diagnosis = $3::jsonb where code = $1 returning code, status, created_at::text as created_at, telemetry, diagnosis",
      [code, JSON.stringify(data.telemetry), JSON.stringify(data.diagnosis)],
    );
    if (!rows[0]) return { ok: false as const, error: "No probe with that code." };
    return { ok: true as const, probe: toRow(rows[0]) };
  });
