import type {
  Diagnosis,
  Finding,
  Fix,
  Severity,
  SymptomId,
  Telemetry,
} from "./types";

function finding(
  id: string,
  area: string,
  severity: Severity,
  title: string,
  detail: string,
): Finding {
  return { id, area, severity, title, detail };
}

const SEV_RANK: Record<Severity, number> = { crit: 4, warn: 3, info: 2, ok: 1 };

function statusFromScore(score: number): Diagnosis["status"] {
  if (score >= 85) return "healthy";
  if (score >= 65) return "fair";
  if (score >= 40) return "poor";
  return "critical";
}

function scoreOf(findings: Finding[]): number {
  let score = 100;
  for (const f of findings) {
    if (f.severity === "crit") score -= 28;
    else if (f.severity === "warn") score -= 12;
    else if (f.severity === "info") score -= 2;
  }
  if (findings.some((f) => f.severity === "crit")) {
    score = Math.min(score, 52);
  }
  const lethal = findings.some(
    (f) => f.id === "adware" || f.id === "disk-dying" || f.id === "net-offline",
  );
  if (lethal) score = Math.min(score, 34);
  return Math.max(0, Math.min(100, score));
}

function pct(used: number, total: number): number {
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

export function diagnose(t: Telemetry, symptom: SymptomId | null): Diagnosis {
  const findings: Finding[] = [];
  const fixes: Fix[] = [];
  const complaint = t.complaint || null;

  const ramPct =
    t.ramUsedPct ??
    (t.jsHeapUsedMb != null && t.jsHeapLimitMb
      ? pct(t.jsHeapUsedMb, t.jsHeapLimitMb)
      : null);

  const diskPct =
    t.diskUsedPct ??
    (t.storageUsedGb != null && t.storageQuotaGb
      ? pct(t.storageUsedGb, t.storageQuotaGb)
      : null);

  if (t.deviceMemoryGb != null && t.deviceMemoryGb <= 4) {
    findings.push(
      finding(
        "ram-low",
        "Memory",
        t.deviceMemoryGb <= 2 ? "crit" : "warn",
        `Only ${t.deviceMemoryGb} GB of RAM`,
        t.deviceMemoryGb <= 2
          ? "This is below what modern browsers and office apps need. The machine will swap constantly."
          : "Eight gigabytes is the comfortable floor. Four works, but Chrome plus a few apps will pin it.",
      ),
    );
  }

  if (ramPct != null && ramPct >= 88) {
    findings.push(
      finding(
        "ram-pressure",
        "Memory",
        ramPct >= 94 ? "crit" : "warn",
        `Memory is ${ramPct}% full`,
        "The machine is thrashing. New windows hitch because there is nowhere to put them.",
      ),
    );
    fixes.push({
      title: "Relieve memory pressure",
      why: "RAM is the first thing that makes a computer feel old.",
      steps: [
        "Quit the browser entirely and reopen only the tabs you need.",
        t.os === "macOS"
          ? "Open Activity Monitor → Memory. Quit anything in the red or yellow."
          : "Open Task Manager → Processes. Sort by Memory. End the heavy ones you do not need.",
        t.startupItemCount && t.startupItemCount > 8
          ? `Trim startup items — this machine launches ${t.startupItemCount} of them.`
          : "Restart once after cleaning so the memory map resets.",
      ],
    });
  } else if (t.deviceMemoryGb != null && t.deviceMemoryGb >= 8 && ramPct != null && ramPct < 70) {
    findings.push(
      finding(
        "ram-ok",
        "Memory",
        "ok",
        `${t.deviceMemoryGb} GB RAM, ${ramPct}% in use`,
        "Memory is not the bottleneck.",
      ),
    );
  }

  if (t.diskHealth === "failing") {
    findings.push(
      finding(
        "disk-dying",
        "Storage",
        "crit",
        "The drive is failing",
        t.diskKind === "hdd"
          ? "SMART is reporting reallocated sectors on a mechanical disk. Freezes during saves are I/O waits, not a 'slow PC'."
          : "The SSD is reporting uncorrectable errors. Replace it before it goes read-only.",
      ),
    );
    fixes.push({
      title: "Back up, then replace the drive",
      why: "A dying disk does not get better. Every extra day is a data-loss bet.",
      steps: [
        "Copy documents, photos, and mail to an external drive or cloud today.",
        t.diskKind === "hdd"
          ? "Replace the hard disk with a 500 GB or 1 TB SSD. The machine will feel new."
          : "Clone to a new SSD of equal or larger size.",
        "Do not run disk-repair utilities in a loop hoping it clears — it will not.",
      ],
    });
  } else if (t.diskHealth === "caution") {
    findings.push(
      finding(
        "disk-caution",
        "Storage",
        "warn",
        "Drive health is caution",
        "Reallocated sectors or rising spare-block use. Not dead yet — not trustworthy either.",
      ),
    );
  }

  if (diskPct != null && diskPct >= 90) {
    findings.push(
      finding(
        "disk-full",
        "Storage",
        diskPct >= 95 ? "crit" : "warn",
        `Storage is ${diskPct}% full`,
        "Operating systems need free space for scratch files, updates, and virtual memory. Below 10% free, everything stutters.",
      ),
    );
    fixes.push({
      title: "Free 15% of the disk",
      why: "A packed drive makes even a fast CPU wait.",
      steps: [
        t.os === "macOS"
          ? "Apple menu → System Settings → General → Storage. Delete large videos and old iOS backups."
          : "Settings → System → Storage. Empty Recycle Bin, then remove unused apps.",
        "Move photos and video off the system drive.",
        "Downloads folders are usually the fastest win.",
      ],
    });
  } else if (t.diskKind === "hdd") {
    findings.push(
      finding(
        "disk-hdd",
        "Storage",
        symptom === "slow" || symptom === "crash" ? "warn" : "info",
        "Mechanical hard disk",
        "A 5400-rpm drive maxes out around 80–100 MB/s. Windows and browsers assume SSD speeds now.",
      ),
    );
  } else if (diskPct != null && diskPct < 80 && t.diskHealth !== "failing") {
    findings.push(
      finding(
        "disk-ok",
        "Storage",
        "ok",
        t.diskKind === "nvme" ? "NVMe storage, healthy" : "Storage looks fine",
        diskPct ? `${diskPct}% used, no SMART alarms.` : "No storage alarms.",
      ),
    );
  }

  if (!t.online) {
    findings.push(
      finding(
        "net-offline",
        "Network",
        "crit",
        "This device is offline",
        "The browser reports no network. Nothing else on this probe will look right until that is fixed.",
      ),
    );
    fixes.push({
      title: "Restore a path to the network",
      why: "Every modern app assumes the internet is there.",
      steps: [
        "Toggle Wi-Fi off and on. If it is Ethernet, reseat the cable.",
        "Forget the network and join again.",
        "If a login page should appear (hotels, airports), open a blank browser tab to http://neverssl.com and wait for the portal.",
      ],
    });
  } else {
    if (t.wifiRssi != null && t.wifiRssi <= -78) {
      findings.push(
        finding(
          "wifi-weak",
          "Network",
          t.wifiRssi <= -82 ? "crit" : "warn",
          `Wi-Fi signal is weak (${t.wifiRssi} dBm)`,
          "Below about −70 dBm, packets start to retry. Below −80, the radio is guessing. That looks like 'the internet is broken'.",
        ),
      );
      fixes.push({
        title: "Move closer or change radios",
        why: "Software cannot fix a weak radio path.",
        steps: [
          "Stand within one room of the router and test again.",
          "If this is a public hotspot, switch to a phone hotspot for a minute. If that is stable, the lounge Wi-Fi is the problem — not the device.",
          "Forget the network, rejoin, and disable 'auto-join' on other SSIDs that fight it.",
        ],
      });
    }
    if (t.rttMs != null && t.rttMs >= 180) {
      findings.push(
        finding(
          "net-rtt",
          "Network",
          t.rttMs >= 350 ? "crit" : "warn",
          `Latency is ${Math.round(t.rttMs)} ms`,
          "Pages that 'spin' are usually waiting on a slow first hop, not a slow computer.",
        ),
      );
    }
    if (t.downlinkMbps != null && t.downlinkMbps > 0 && t.downlinkMbps < 2) {
      findings.push(
        finding(
          "net-slow",
          "Network",
          "warn",
          `Throughput about ${t.downlinkMbps} Mbps`,
          "That is enough for mail, not for video or cloud backups. Large pages will crawl.",
        ),
      );
    }
    if (
      (t.rttMs == null || t.rttMs < 80) &&
      (t.downlinkMbps == null || t.downlinkMbps >= 10) &&
      (t.wifiRssi == null || t.wifiRssi > -70)
    ) {
      findings.push(
        finding(
          "net-ok",
          "Network",
          "ok",
          t.connectionType
            ? `Network ${t.connectionType}${t.downlinkMbps ? ` · ${t.downlinkMbps} Mbps` : ""}`
            : "Network path looks fine",
          t.rttMs != null ? `Round trip ${t.rttMs} ms.` : "The browser is online with no red flags.",
        ),
      );
    }
  }

  if (t.thermalThrottle || (t.gpuTempC != null && t.gpuTempC >= 88) || (t.cpuTempC != null && t.cpuTempC >= 90)) {
    const where =
      t.gpuTempC != null && t.cpuTempC != null && t.gpuTempC >= t.cpuTempC
        ? `GPU ${t.gpuTempC}°C`
        : t.cpuTempC != null
          ? `CPU ${t.cpuTempC}°C`
          : t.gpuTempC != null
            ? `GPU ${t.gpuTempC}°C`
            : "thermal throttle";
    findings.push(
      finding(
        "thermal",
        "Thermals",
        t.gpuTempC != null && t.gpuTempC >= 90 ? "crit" : "warn",
        `Overheating (${where})`,
        "The chip is slowing itself down to survive. After a few minutes it will stutter, then the driver may reset — which looks like a crash.",
      ),
    );
    fixes.push({
      title: "Cool the machine before you replace parts",
      why: "Heat is the most common 'my PC is broken' that is not actually a broken part.",
      steps: [
        "Power off. Open the case or flip a laptop and clear dust from the vents with short bursts of air.",
        "Give the machine a hard surface and a few inches of air. Beds and couches block intakes.",
        t.gpu ? `Update the ${t.gpu} driver after it is cool. Old drivers panic first under heat.` : "Update graphics drivers after it cools.",
        "If it still hits 90°C in a game after a dust-out, the thermal paste or cooler is due.",
      ],
    });
  } else if (t.cpuTempC != null && t.cpuTempC < 75) {
    findings.push(
      finding(
        "thermal-ok",
        "Thermals",
        "ok",
        `CPU ${t.cpuTempC}°C`,
        t.gpuTempC != null ? `GPU ${t.gpuTempC}°C. No throttle.` : "No thermal throttle.",
      ),
    );
  }

  if (t.malwareIndicators && t.malwareIndicators.length) {
    findings.push(
      finding(
        "adware",
        "Security",
        "crit",
        "This looks like adware, not a broken PC",
        t.malwareIndicators.join(" · "),
      ),
    );
    fixes.push({
      title: "Remove the hijack, then the leftovers",
      why: "Pop-ups and a changed homepage are almost never a hardware fault.",
      steps: [
        "Uninstall anything named optimizer, cleaner, coupon, PDF helper, or 'search protect' that you did not choose.",
        "In the browser: remove unknown extensions, then reset settings to default. Set the search engine back to Google, Bing, or DuckDuckGo by hand.",
        t.os === "Windows"
          ? "Run Windows Security (or Malwarebytes) a full scan. Restart when it finishes."
          : "Run Malwarebytes. On a Mac, also check Login Items and Profiles in System Settings.",
        "Change the passwords that were typed while this was installed, starting with mail and the bank.",
      ],
    });
  }

  if (t.extensionCount != null && t.extensionCount >= 10 && !t.malwareIndicators?.length) {
    findings.push(
      finding(
        "extensions",
        "Security",
        "warn",
        `${t.extensionCount} browser extensions`,
        "Each one sits on every page. A pile of them is a common source of hijacks and slowdowns.",
      ),
    );
  }

  if (t.pendingUpdates != null && t.pendingUpdates >= 20) {
    findings.push(
      finding(
        "updates",
        "System",
        symptom === "boot" ? "crit" : "warn",
        `${t.pendingUpdates} updates waiting`,
        symptom === "boot"
          ? "A stuck update is the usual reason a Windows machine sits on spinning dots."
          : "Old patches often include the graphics and disk fixes people think they need new hardware for.",
      ),
    );
    if (symptom === "boot" || t.pendingUpdates >= 30) {
      fixes.push({
        title: "Let the pending update finish",
        why: "Half-applied Windows updates hang at the logo.",
        steps: [
          "Hold the power button 10 seconds. Power on and wait — 20 to 40 minutes is normal for a piled-up update. Do not keep force-restarting.",
          "If it is still looping: power on, interrupt three times to reach Repair, then Startup Repair.",
          "After it boots, install remaining updates in one sitting and restart until it says you are current.",
        ],
      });
    }
  }

  if (t.cpuCores != null && t.cpuCores <= 2) {
    findings.push(
      finding(
        "cpu-dual",
        "CPU",
        symptom === "slow" ? "warn" : "info",
        `Only ${t.cpuCores} CPU cores`,
        "Dual-core machines fall over once a browser, mail, and a video call are open at once.",
      ),
    );
  } else if (t.cpuCores != null) {
    findings.push(
      finding(
        "cpu-ok",
        "CPU",
        "ok",
        `${t.cpuCores} cores`,
        t.cpuBenchMs != null
          ? `Probe workload finished in ${t.cpuBenchMs} ms.`
          : "CPU count is not the limiter.",
      ),
    );
  }

  if (t.cpuBenchMs != null && t.cpuBenchMs >= 90 && (t.cpuCores == null || t.cpuCores <= 4)) {
    findings.push(
      finding(
        "cpu-slow",
        "CPU",
        "warn",
        "CPU probe ran hot and slow",
        `A short math workload took ${t.cpuBenchMs} ms. On a healthy modern chip it is usually under 40 ms. Heat or an old dual-core will do this.`,
      ),
    );
  }

  if (t.startupItemCount != null && t.startupItemCount >= 15) {
    findings.push(
      finding(
        "startup",
        "System",
        "info",
        `${t.startupItemCount} startup items`,
        "A long login is almost always this list, not a dying motherboard.",
      ),
    );
  }

  if (t.batteryLevel != null && t.batteryLevel <= 0.15 && t.batteryCharging === false) {
    findings.push(
      finding(
        "battery-low",
        "Power",
        "info",
        `Battery at ${Math.round(t.batteryLevel * 100)}%`,
        "Some laptops silently underclock at this level. Plug in before you judge performance.",
      ),
    );
  }

  if (t.source === "live") {
    findings.push(
      finding(
        "probe-scope",
        "Scope",
        "info",
        "Browser probe — not a kernel agent",
        "This pass can see CPU cores, memory hints, GPU name, network, and storage estimates. It cannot read SMART data, installed programs, or temperatures on this device. For those, use the lab machines or have the owner describe the symptom.",
      ),
    );
  }

  if (symptom === "sound") {
    findings.push(
      finding(
        "sound",
        "Audio",
        "warn",
        "Reported: no sound",
        "Hardware probes rarely catch this. It is almost always the wrong output device, a mute key, or a disabled exclusive-mode device.",
      ),
    );
    fixes.push({
      title: "Force the correct output",
      why: "Windows and macOS love to route audio to a dead HDMI or Bluetooth sink.",
      steps: [
        "Check the mute key and the volume mixer.",
        t.os === "macOS"
          ? "Option-click the speaker in the menu bar. Pick Internal Speakers."
          : "Click the speaker on the taskbar. Pick the real speakers or headset, not 'NVIDIA output' or a TV that is off.",
        "Unplug and replug the headset. On Bluetooth, forget the device and pair again.",
      ],
    });
  }

  if (symptom === "display") {
    findings.push(
      finding(
        "display",
        "Display",
        "warn",
        "Reported: screen trouble",
        t.gpu
          ? `GPU reports as ${t.gpu}. Flicker after 10–20 minutes is often a driver or a loose cable, not the panel.`
          : "Flicker, black screens, and wrong resolution are usually driver or cable, not the glass.",
      ),
    );
    fixes.push({
      title: "Rule out cable and driver first",
      why: "Replacing a panel is expensive. Reseating a cable is free.",
      steps: [
        "Reseat HDMI/DisplayPort at both ends. Try another cable.",
        "Boot to the manufacturer's graphics driver page and install the current one — not Windows Update's.",
        "If the screen is black but you can hear Windows: try Win+Ctrl+Shift+B to reset the graphics driver.",
      ],
    });
  }

  if (symptom === "battery" && t.batteryLevel != null) {
    findings.push(
      finding(
        "battery-health",
        "Power",
        "warn",
        "Reported: battery dies fast",
        "A browser probe cannot read cycle count. If it drops 20% in an hour on idle, the pack is the suspect — not Windows.",
      ),
    );
    fixes.push({
      title: "Measure drain, then decide on a pack",
      why: "A tired battery looks like a slow computer because the chip underclocks.",
      steps: [
        t.os === "macOS"
          ? "Hold Option and click the battery. Note condition. System Settings → Battery → Battery Health."
          : "Open a Command Prompt and run: powercfg /batteryreport. Open the HTML file it writes to your user folder.",
        "Test with the charger in. If it is snappy on AC and dead on battery, replace the pack.",
        "Turn off wake-on-network and close leftover video-call apps. They pin the radio all night.",
      ],
    });
  }

  if (findings.every((f) => f.severity === "ok" || f.severity === "info") && symptom === "slow") {
    findings.push(
      finding(
        "slow-software",
        "Software",
        "warn",
        "Hardware looks fine — this is software load",
        "Cores, memory, and network are not in the red. The lag is coming from too many tabs, a heavy page, or a stuck process — not a dying machine.",
      ),
    );
    fixes.push({
      title: "Cut the working set in half",
      why: "A healthy PC still feels broken with 40 tabs and two video calls.",
      steps: [
        "Restart the browser. Keep one window.",
        t.os === "macOS"
          ? "Activity Monitor → CPU. Quit anything using more than 30% that you do not recognize."
          : "Task Manager → Processes. End tasks you do not need. Watch Disk — if it sits at 100%, that process is the story.",
        "Restart the computer once after that. If it is still slow on a clean boot, come back and send another probe.",
      ],
    });
  }

  const ranked = [...findings].sort((a, b) => SEV_RANK[b.severity] - SEV_RANK[a.severity]);
  const primary = ranked.find((f) => f.severity === "crit") || ranked.find((f) => f.severity === "warn") || ranked[0];
  const score = scoreOf(findings);
  const status = statusFromScore(score);

  const headline = !primary || primary.severity === "ok"
    ? "This machine looks healthy."
    : /[.!?]$/.test(primary.title)
      ? primary.title
      : `${primary.title}.`;

  const name = t.deviceName;
  const summary = buildSummary(t, primary, status, complaint, symptom);

  if (fixes.length === 0 && status === "healthy") {
    fixes.push({
      title: "Keep it that way",
      why: "Nothing on this probe is on fire.",
      steps: [
        "Install pending updates on a night you can let it sit.",
        "Keep 15% of the disk free.",
        "If a person is still unhappy with it, the problem is an app — have them send another probe while it is misbehaving.",
      ],
    });
  }

  return {
    score,
    status,
    headline: tidyHeadline(headline, status),
    summary: `${name}: ${summary}`,
    primaryArea: primary?.area ?? "System",
    findings: ranked,
    fixes: uniqueFixes(fixes),
  };
}

function tidyHeadline(headline: string, status: Diagnosis["status"]): string {
  if (status === "healthy" && !/healthy|fine|no faults/i.test(headline)) {
    return "This machine looks healthy.";
  }
  return headline;
}

function buildSummary(
  t: Telemetry,
  primary: Finding | undefined,
  status: Diagnosis["status"],
  complaint: string | null,
  symptom: SymptomId | null,
): string {
  const asked = complaint || (symptom && symptom !== "other" ? SYMPTOM_LINE[symptom] : null);
  if (status === "healthy") {
    return asked
      ? `Hardware is not the story. They said “${asked}” — look at software load and the network path, not a parts swap.`
      : "No critical faults. CPU, memory, storage, and network are inside normal range on this pass.";
  }
  if (!primary) {
    return asked ? `They reported “${asked}”. The probe did not pin a single hardware fault.` : "Mixed signals. Read the findings.";
  }
  const lead = asked ? `They reported “${asked}”. ` : "";
  return `${lead}${primary.detail}`;
}

const SYMPTOM_LINE: Record<Exclude<SymptomId, "other">, string> = {
  slow: "slow or laggy",
  offline: "can't get online",
  heat: "hot or loud",
  crash: "crashes or freezes",
  ads: "pop-ups",
  sound: "no sound",
  display: "screen trouble",
  battery: "battery dies fast",
  boot: "won't start",
};

function uniqueFixes(fixes: Fix[]): Fix[] {
  const seen = new Set<string>();
  const out: Fix[] = [];
  for (const f of fixes) {
    if (seen.has(f.title)) continue;
    seen.add(f.title);
    out.push(f);
  }
  return out.slice(0, 4);
}
