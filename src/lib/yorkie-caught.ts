import type { Report } from "./types";

/** Last live report pulled from Yorkie's machine. */
export const YORKIE_CAUGHT: Report = {
  id: "YRK1-HELP",
  targetName: "Windows device",
  createdAt: "2026-08-27T08:59:27.824Z",
  probeCode: "YRK1-HELP",
  symptom: null,
  telemetry: {
    source: "live",
    capturedAt: "2026-08-27T09:18:00.000Z",
    deviceName: "Windows device",
    os: "Windows",
    osVersion: "19.0.0",
    browser: "Google Chrome 151",
    cpuCores: 12,
    deviceMemoryGb: 32,
    jsHeapUsedMb: 3,
    jsHeapLimitMb: 4192,
    cpuBenchMs: 3.1,
    storageQuotaGb: 10.74,
    storageUsedGb: 0,
    connectionType: "4g",
    downlinkMbps: 58.8,
    rttMs: 250,
    online: true,
    gpu: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x0000A7A1) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    screen: "1600×900",
    dpr: 1,
    batteryLevel: 1,
    batteryCharging: true,
    languages: ["en-US", "en"],
    timezone: "America/Chicago",
    touch: true,
    cookiesEnabled: true,
  },
  diagnosis: {
    score: 86,
    status: "healthy",
    headline: "Latency is 250 ms.",
    summary: "Windows device: Pages that spin are usually waiting on a slow first hop, not a slow computer.",
    primaryArea: "Network",
    findings: [
      {
        id: "net-rtt",
        area: "Network",
        severity: "warn",
        title: "Latency is 250 ms",
        detail: "Pages that spin are usually waiting on a slow first hop, not a slow computer.",
      },
      {
        id: "probe-scope",
        area: "Scope",
        severity: "info",
        title: "Browser probe — not a kernel agent",
        detail:
          "This pass can see cores, memory hints, GPU name, network, and storage estimates. It cannot read SMART data or temperatures.",
      },
    ],
    fixes: [
      {
        title: "Keep it that way",
        why: "",
        steps: [
          "Install pending updates on a night you can let it sit.",
          "Keep 15% of the disk free.",
          "If it still feels wrong, run this again while it is misbehaving.",
        ],
      },
    ],
  },
};
