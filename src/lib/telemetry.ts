import type { Telemetry } from "./types";

type NavWithMemory = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    type?: string;
  };
  userAgentData?: {
    platform?: string;
    brands?: { brand: string; version: string }[];
    mobile?: boolean;
    getHighEntropyValues?: (hints: string[]) => Promise<{
      platform?: string;
      platformVersion?: string;
      model?: string;
      uaFullVersion?: string;
      architecture?: string;
      bitness?: string;
    }>;
  };
};

type PerfWithMemory = Performance & {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
};

type BatteryLike = {
  level: number;
  charging: boolean;
};

function parseBrowser(ua: string, nav: NavWithMemory): string {
  const brand = nav.userAgentData?.brands?.find(
    (b) => !/not/i.test(b.brand) && b.brand !== "Chromium",
  );
  if (brand) return `${brand.brand} ${brand.version}`;
  if (/Edg\//.test(ua)) return `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1] ?? ""}`.trim();
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua))
    return `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]?.split(".")[0] ?? ""}`.trim();
  if (/Firefox\//.test(ua))
    return `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""}`.trim();
  if (/Safari\//.test(ua) && /Version\//.test(ua))
    return `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] ?? ""}`.trim();
  return "Unknown browser";
}

function parseOs(ua: string, platform?: string): { os: string; osVersion?: string } {
  if (platform) {
    if (/mac/i.test(platform)) return { os: "macOS" };
    if (/win/i.test(platform)) return { os: "Windows" };
    if (/linux/i.test(platform)) return { os: "Linux" };
    if (/android/i.test(platform)) return { os: "Android" };
    if (/ios|iphone|ipad/i.test(platform)) return { os: "iOS" };
  }
  if (/Windows NT 10/.test(ua)) return { os: "Windows", osVersion: "10/11" };
  if (/Mac OS X/.test(ua)) {
    const v = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".");
    return { os: "macOS", osVersion: v };
  }
  if (/Android/.test(ua)) {
    const v = ua.match(/Android ([\d.]+)/)?.[1];
    return { os: "Android", osVersion: v };
  }
  if (/iPhone|iPad/.test(ua)) return { os: "iOS" };
  if (/Linux/.test(ua)) return { os: "Linux" };
  if (/CrOS/.test(ua)) return { os: "ChromeOS" };
  return { os: platform || "Unknown OS" };
}

function gpuName(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      if (typeof renderer === "string" && renderer.length) return renderer;
    }
    const fallback = gl.getParameter(gl.RENDERER);
    return typeof fallback === "string" ? fallback : null;
  } catch {
    return null;
  }
}

function cpuBench(): number {
  const t0 = performance.now();
  let x = 0;
  for (let i = 0; i < 1_400_000; i += 1) x += Math.sqrt(i & 255);
  const ms = performance.now() - t0;
  return Math.round((ms + x * 0) * 10) / 10;
}

async function readBattery(): Promise<BatteryLike | null> {
  const nav = navigator as Navigator & {
    getBattery?: () => Promise<BatteryLike>;
  };
  if (typeof nav.getBattery !== "function") return null;
  try {
    return await nav.getBattery();
  } catch {
    return null;
  }
}

export async function collectLiveTelemetry(): Promise<Telemetry> {
  const nav = navigator as NavWithMemory;
  const ua = nav.userAgent || "";
  const conn = nav.connection;
  const mem = (performance as PerfWithMemory).memory;
  const uaData = nav.userAgentData;
  let high:
    | {
        platform?: string;
        platformVersion?: string;
        model?: string;
      }
    | undefined;
  try {
    high = await uaData?.getHighEntropyValues?.([
      "platform",
      "platformVersion",
      "model",
      "architecture",
    ]);
  } catch {
    high = undefined;
  }

  const { os, osVersion } = parseOs(ua, high?.platform || uaData?.platform || nav.platform);
  const battery = await readBattery();

  let storageQuotaGb: number | null = null;
  let storageUsedGb: number | null = null;
  try {
    if (nav.storage?.estimate) {
      const est = await nav.storage.estimate();
      if (est.quota) storageQuotaGb = Math.round((est.quota / 1e9) * 100) / 100;
      if (typeof est.usage === "number")
        storageUsedGb = Math.round((est.usage / 1e9) * 1000) / 1000;
    }
  } catch {
    /* ignore */
  }

  const deviceName =
    high?.model && high.model.length > 1
      ? high.model
      : `${os}${osVersion ? ` ${osVersion}` : ""} device`;

  return {
    source: "live",
    capturedAt: new Date().toISOString(),
    deviceName,
    os,
    osVersion: high?.platformVersion || osVersion,
    browser: parseBrowser(ua, nav),
    cpuCores: nav.hardwareConcurrency || null,
    deviceMemoryGb: typeof nav.deviceMemory === "number" ? nav.deviceMemory : null,
    jsHeapUsedMb: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
    jsHeapLimitMb: mem ? Math.round(mem.jsHeapSizeLimit / 1048576) : null,
    cpuBenchMs: cpuBench(),
    storageQuotaGb,
    storageUsedGb,
    connectionType: conn?.effectiveType || conn?.type || null,
    downlinkMbps: typeof conn?.downlink === "number" ? conn.downlink : null,
    rttMs: typeof conn?.rtt === "number" ? conn.rtt : null,
    online: nav.onLine,
    gpu: gpuName(),
    screen: `${window.screen.width}×${window.screen.height}`,
    dpr: Math.round(window.devicePixelRatio * 100) / 100,
    batteryLevel: battery ? battery.level : null,
    batteryCharging: battery ? battery.charging : null,
    languages: [...(nav.languages?.length ? nav.languages : [nav.language].filter(Boolean))],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touch: nav.maxTouchPoints > 0,
    cookiesEnabled: nav.cookieEnabled,
  };
}
