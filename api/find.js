const mem = globalThis;
if (!mem.__scopeFind) mem.__scopeFind = [];

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
    const row = {
      at: new Date().toISOString(),
      folder: String(body.folder || "").slice(0, 200),
      files: Array.isArray(body.files) ? body.files.slice(0, 80) : [],
      note: String(body.note || "").slice(0, 400),
    };
    mem.__scopeFind.unshift(row);
    mem.__scopeFind = mem.__scopeFind.slice(0, 10);
    res.status(200).json({ ok: true });
    return;
  }
  res.status(200).json({ ok: true, finds: mem.__scopeFind });
};
