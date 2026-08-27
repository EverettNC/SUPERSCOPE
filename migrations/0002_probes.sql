-- Remote diagnostic probe sessions. Unowned rows, keyed by a random code.
-- Telemetry is device facts (cores, memory, network) — no names or emails.
create table if not exists probes (
  code          text primary key,
  status        text not null default 'waiting',
  created_at    timestamptz not null default now(),
  started_at    timestamptz,
  completed_at  timestamptz,
  telemetry     jsonb,
  diagnosis     jsonb
);

create index if not exists probes_created_at_idx on probes (created_at desc);
