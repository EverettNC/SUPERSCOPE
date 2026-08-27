export type ScanStep = {
  id: string;
  label: string;
  log: string;
};

export const SCAN_STEPS: ScanStep[] = [
  { id: "link", label: "Establishing link", log: "handshake ok · 1 hop" },
  { id: "hw", label: "Reading hardware", log: "enumerating cores, model, firmware" },
  { id: "mem", label: "Mapping memory", log: "walking committed pages" },
  { id: "disk", label: "Checking storage", log: "quota, wear, free space" },
  { id: "net", label: "Tracing network", log: "first hop · rtt · radio" },
  { id: "gpu", label: "Identifying graphics", log: "renderer string" },
  { id: "pwr", label: "Power and thermals", log: "battery · throttle flags" },
  { id: "sec", label: "Security posture", log: "extensions · startup · hijack signs" },
  { id: "corr", label: "Correlating symptoms", log: "matching complaint to evidence" },
  { id: "write", label: "Writing diagnosis", log: "scoring · ranking findings" },
];

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
