export type Severity = "ok" | "info" | "warn" | "crit";

export type SymptomId =
  | "slow"
  | "offline"
  | "heat"
  | "crash"
  | "ads"
  | "sound"
  | "display"
  | "battery"
  | "boot"
  | "other";

export type Finding = {
  id: string;
  area: string;
  severity: Severity;
  title: string;
  detail: string;
};

export type Fix = {
  title: string;
  why: string;
  steps: string[];
};

export type Diagnosis = {
  score: number;
  status: "healthy" | "fair" | "poor" | "critical";
  headline: string;
  summary: string;
  primaryArea: string;
  findings: Finding[];
  fixes: Fix[];
};

export type Telemetry = {
  source: "live" | "lab";
  capturedAt: string;
  deviceName: string;
  os: string;
  osVersion?: string;
  browser: string;
  cpuCores: number | null;
  deviceMemoryGb: number | null;
  jsHeapUsedMb: number | null;
  jsHeapLimitMb: number | null;
  cpuBenchMs: number | null;
  storageQuotaGb: number | null;
  storageUsedGb: number | null;
  connectionType: string | null;
  downlinkMbps: number | null;
  rttMs: number | null;
  online: boolean;
  gpu: string | null;
  screen: string;
  dpr: number;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  languages: string[];
  timezone: string;
  touch: boolean;
  cookiesEnabled: boolean;
  diskHealth?: "ok" | "caution" | "failing";
  diskKind?: "ssd" | "hdd" | "nvme";
  diskUsedPct?: number;
  ramUsedPct?: number;
  cpuTempC?: number;
  gpuTempC?: number;
  startupItemCount?: number;
  extensionCount?: number;
  pendingUpdates?: number;
  thermalThrottle?: boolean;
  wifiRssi?: number;
  malwareIndicators?: string[];
  uptimeHours?: number;
  complaint?: string;
};

export type Report = {
  id: string;
  targetName: string;
  createdAt: string;
  diagnosis: Diagnosis;
  telemetry: Telemetry;
  symptom: SymptomId | null;
  probeCode?: string;
};

export const SYMPTOMS: { id: SymptomId; label: string; hint: string }[] = [
  { id: "slow", label: "Slow or laggy", hint: "Apps hitch, spinning wheels" },
  { id: "offline", label: "Can't get online", hint: "Wi-Fi drops, pages stall" },
  { id: "heat", label: "Hot or loud", hint: "Fans scream, chassis burns" },
  { id: "crash", label: "Crashes or freezes", hint: "Restarts, lockups" },
  { id: "ads", label: "Pop-ups or hijack", hint: "Strange search, extra toolbars" },
  { id: "sound", label: "No sound", hint: "Mute, missing device" },
  { id: "display", label: "Screen trouble", hint: "Flicker, black, wrong size" },
  { id: "battery", label: "Battery dies fast", hint: "Won't hold a charge" },
  { id: "boot", label: "Won't start", hint: "Stuck on logo or login" },
  { id: "other", label: "Not sure", hint: "Just run the probe" },
];
