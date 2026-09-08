const mem = globalThis;
if (!mem.__scopeEar) mem.__scopeEar = [];

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

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method === "POST") {
    const body = parseBody(req) || {};
    const text = String(body.text || "").trim().slice(0, 800);
    if (!text) {
      res.status(400).json({ ok: false, error: "Need speech." });
      return;
    }
    const row = {
      text,
      at: new Date().toISOString(),
      code: String(body.code || "YRK1-HELP"),
    };
    mem.__scopeEar.unshift(row);
    mem.__scopeEar = mem.__scopeEar.slice(0, 40);
    res.status(200).json({ ok: true });
    return;
  }
  res.status(200).json({ ok: true, heard: mem.__scopeEar });
};
