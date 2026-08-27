const DROP = "https://webhook.site/6be3d5b5-949d-4839-b8a6-446582e7bc58";
const LIST =
  "https://webhook.site/token/6be3d5b5-949d-4839-b8a6-446582e7bc58/requests?sorting=newest&per_page=12";

const mem = globalThis;
if (!mem.__scopeInbox) mem.__scopeInbox = new Map();

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}

function parseBody(req) {
  const raw = req.body;
  if (raw == null) return null;
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) return raw;
  const text = Buffer.isBuffer(raw) ? raw.toString("utf8") : String(raw);
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isReport(value) {
  if (!value || typeof value !== "object") return false;
  const d = value.diagnosis;
  const t = value.telemetry;
  return Boolean(d && t && d.headline && t.deviceName);
}

function compactCode(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    if (!isReport(body)) {
      res.status(400).json({ ok: false, error: "Need a report." });
      return;
    }
    mem.__scopeInbox.set(compactCode(body.code || "YRK1HELP"), body);
    await fetch(DROP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    res.status(200).json({ ok: true });
    return;
  }

  const wanted = compactCode(req.query.code || "YRK1-HELP");
  const hit = mem.__scopeInbox.get(wanted);
  if (isReport(hit)) {
    res.status(200).json({ ok: true, report: hit });
    return;
  }

  try {
    const listed = await fetch(LIST, { headers: { Accept: "application/json" } });
    const data = await listed.json();
    const rows = Array.isArray(data.data) ? data.data : [];
    for (const row of rows) {
      try {
        const parsed = typeof row.content === "string" ? JSON.parse(row.content) : row.content;
        if (!isReport(parsed)) continue;
        const code = compactCode(parsed.code || "");
        if (wanted && code && code !== wanted) continue;
        res.status(200).json({ ok: true, report: parsed });
        return;
      } catch {
        /* skip junk */
      }
    }
  } catch {
    /* fall through */
  }
  res.status(200).json({ ok: true, report: null });
};
