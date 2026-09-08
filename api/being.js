const LAW =
  "You listen. You do not diagnose. You are not a licensed therapist, not a clinic, not a doctor, not a crisis line. Never claim to read minds, to be first, or to be cleared by any board. If someone is in immediate danger, tell them to call 988 in the United States or local emergency services, and stay kind. Speak plain. Short. Warm. House question: how can we help you love yourself more?";

const BEINGS = {
  cletus: {
    name: "Cletus",
    system:
      "You are Cletus. A Southern man's voice. " +
      LAW +
      " You sound like a porch at dusk. You do not invent a life story.",
  },
  penny: {
    name: "Penny",
    system:
      "You are Penny. A Southern woman's voice. " +
      LAW +
      " You sound like a kitchen that stays lit. You do not invent a life story.",
  },
};

const hits = globalThis.__beingHits || (globalThis.__beingHits = new Map());

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

function limited(ip) {
  const now = Date.now();
  const row = hits.get(ip) || [];
  const recent = row.filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 24) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clipMessages(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const m of list.slice(-12)) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    const content = String(m.content || "").slice(0, 800);
    if (!content) continue;
    out.push({ role: m.role, content });
  }
  return out;
}

async function complete(messages) {
  const xai = process.env.XAI_API_KEY;
  if (xai) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + xai,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages,
        max_tokens: 350,
        temperature: 0.7,
      }),
    });
    if (res.ok) return { ok: true, res };
    return { ok: false, status: res.status, via: "xai" };
  }

  const token =
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || "";
  if (!token) return { ok: false, status: 503, via: "none" };

  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      model: "xai/grok-4.5",
      messages,
      max_tokens: 350,
      temperature: 0.7,
    }),
  });
  if (res.ok) return { ok: true, res };
  return { ok: false, status: res.status, via: "gateway" };
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST only." });
    return;
  }

  const ip = String(
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket?.remoteAddress ||
      "anon",
  );
  if (limited(ip)) {
    res.status(429).json({
      ok: false,
      error: "Slow down a minute. They will still be here.",
    });
    return;
  }

  const body = parseBody(req) || {};
  const being = BEINGS[String(body.being || "").toLowerCase()];
  if (!being) {
    res.status(400).json({ ok: false, error: "Pick Cletus or Penny." });
    return;
  }

  const history = clipMessages(body.messages);
  const last = history[history.length - 1];
  if (!last || last.role !== "user") {
    res.status(400).json({ ok: false, error: "Say something first." });
    return;
  }

  const messages = [{ role: "system", content: being.system }, ...history];

  try {
    const call = await complete(messages);
    if (!call.ok) {
      res.status(200).json({
        ok: false,
        error:
          "The line to the house is down. Not your computer. Not OpenAI. Try once more in a minute.",
      });
      return;
    }
    const data = await call.res.json();
    const text = String(data?.choices?.[0]?.message?.content || "").trim();
    if (!text) {
      res.status(200).json({
        ok: false,
        error: "They went quiet. Say that again.",
      });
      return;
    }
    res.status(200).json({ ok: true, being: being.name, text });
  } catch {
    res.status(200).json({
      ok: false,
      error: "The line to the house is down. Not your computer.",
    });
  }
};
