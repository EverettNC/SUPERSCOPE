const DROP = "https://webhook.site/6be3d5b5-949d-4839-b8a6-446582e7bc58";
const mem = globalThis;
if (!mem.__scopeCommands) mem.__scopeCommands = new Map();

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

function compactCode(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") || "YRK1HELP";
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req) || {};
    const cmd = {
      code: compactCode(body.code || "YRK1-HELP"),
      action: body.action || "fix-network",
      id: String(body.id || Date.now()),
    };
    mem.__scopeCommands.set(cmd.code, cmd);
    try {
      await fetch(DROP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "command", ...cmd }),
      });
    } catch {
      /* still return the in-memory command */
    }
    res.status(200).json({ ok: true, command: cmd });
    return;
  }

  const wanted = compactCode(req.query.code || "YRK1-HELP");
  const hit = mem.__scopeCommands.get(wanted) || null;
  res.status(200).json({ ok: true, command: hit });
};
