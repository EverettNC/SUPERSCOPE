export const COMMAND_URL = "https://yorkie-probe.vercel.app/api/command";

export async function dispatchFix(code = "YRK1-HELP"): Promise<boolean> {
  const body = JSON.stringify({
    code,
    action: "fix-network",
    id: String(Date.now()),
  });
  try {
    const res = await fetch(COMMAND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return res.ok;
  } catch {
    return false;
  }
}
