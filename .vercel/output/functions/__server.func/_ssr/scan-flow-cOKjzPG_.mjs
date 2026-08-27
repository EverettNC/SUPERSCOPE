import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, n as Button } from "./createSsrRpc-CRUGmq6G.mjs";
import { i as newId, s as useReports, t as ReportView } from "./store-CrYC-xFx.mjs";
import { t as Reticle } from "./reticle-BGG377a4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-flow-cOKjzPG_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function finding(id, area, severity, title, detail) {
	return {
		id,
		area,
		severity,
		title,
		detail
	};
}
var SEV_RANK = {
	crit: 4,
	warn: 3,
	info: 2,
	ok: 1
};
function statusFromScore(score) {
	if (score >= 85) return "healthy";
	if (score >= 65) return "fair";
	if (score >= 40) return "poor";
	return "critical";
}
function scoreOf(findings) {
	let score = 100;
	for (const f of findings) if (f.severity === "crit") score -= 28;
	else if (f.severity === "warn") score -= 12;
	else if (f.severity === "info") score -= 2;
	if (findings.some((f) => f.severity === "crit")) score = Math.min(score, 52);
	if (findings.some((f) => f.id === "adware" || f.id === "disk-dying" || f.id === "net-offline")) score = Math.min(score, 34);
	return Math.max(0, Math.min(100, score));
}
function pct(used, total) {
	if (!total) return 0;
	return Math.round(used / total * 100);
}
function diagnose(t, symptom) {
	const findings = [];
	const fixes = [];
	const complaint = t.complaint || null;
	const ramPct = t.ramUsedPct ?? (t.jsHeapUsedMb != null && t.jsHeapLimitMb ? pct(t.jsHeapUsedMb, t.jsHeapLimitMb) : null);
	const diskPct = t.diskUsedPct ?? (t.storageUsedGb != null && t.storageQuotaGb ? pct(t.storageUsedGb, t.storageQuotaGb) : null);
	if (t.deviceMemoryGb != null && t.deviceMemoryGb <= 4) findings.push(finding("ram-low", "Memory", t.deviceMemoryGb <= 2 ? "crit" : "warn", `Only ${t.deviceMemoryGb} GB of RAM`, t.deviceMemoryGb <= 2 ? "This is below what modern browsers and office apps need. The machine will swap constantly." : "Eight gigabytes is the comfortable floor. Four works, but Chrome plus a few apps will pin it."));
	if (ramPct != null && ramPct >= 88) {
		findings.push(finding("ram-pressure", "Memory", ramPct >= 94 ? "crit" : "warn", `Memory is ${ramPct}% full`, "The machine is thrashing. New windows hitch because there is nowhere to put them."));
		fixes.push({
			title: "Relieve memory pressure",
			why: "RAM is the first thing that makes a computer feel old.",
			steps: [
				"Quit the browser entirely and reopen only the tabs you need.",
				t.os === "macOS" ? "Open Activity Monitor → Memory. Quit anything in the red or yellow." : "Open Task Manager → Processes. Sort by Memory. End the heavy ones you do not need.",
				t.startupItemCount && t.startupItemCount > 8 ? `Trim startup items — this machine launches ${t.startupItemCount} of them.` : "Restart once after cleaning so the memory map resets."
			]
		});
	} else if (t.deviceMemoryGb != null && t.deviceMemoryGb >= 8 && ramPct != null && ramPct < 70) findings.push(finding("ram-ok", "Memory", "ok", `${t.deviceMemoryGb} GB RAM, ${ramPct}% in use`, "Memory is not the bottleneck."));
	if (t.diskHealth === "failing") {
		findings.push(finding("disk-dying", "Storage", "crit", "The drive is failing", t.diskKind === "hdd" ? "SMART is reporting reallocated sectors on a mechanical disk. Freezes during saves are I/O waits, not a 'slow PC'." : "The SSD is reporting uncorrectable errors. Replace it before it goes read-only."));
		fixes.push({
			title: "Back up, then replace the drive",
			why: "A dying disk does not get better. Every extra day is a data-loss bet.",
			steps: [
				"Copy documents, photos, and mail to an external drive or cloud today.",
				t.diskKind === "hdd" ? "Replace the hard disk with a 500 GB or 1 TB SSD. The machine will feel new." : "Clone to a new SSD of equal or larger size.",
				"Do not run disk-repair utilities in a loop hoping it clears — it will not."
			]
		});
	} else if (t.diskHealth === "caution") findings.push(finding("disk-caution", "Storage", "warn", "Drive health is caution", "Reallocated sectors or rising spare-block use. Not dead yet — not trustworthy either."));
	if (diskPct != null && diskPct >= 90) {
		findings.push(finding("disk-full", "Storage", diskPct >= 95 ? "crit" : "warn", `Storage is ${diskPct}% full`, "Operating systems need free space for scratch files, updates, and virtual memory. Below 10% free, everything stutters."));
		fixes.push({
			title: "Free 15% of the disk",
			why: "A packed drive makes even a fast CPU wait.",
			steps: [
				t.os === "macOS" ? "Apple menu → System Settings → General → Storage. Delete large videos and old iOS backups." : "Settings → System → Storage. Empty Recycle Bin, then remove unused apps.",
				"Move photos and video off the system drive.",
				"Downloads folders are usually the fastest win."
			]
		});
	} else if (t.diskKind === "hdd") findings.push(finding("disk-hdd", "Storage", symptom === "slow" || symptom === "crash" ? "warn" : "info", "Mechanical hard disk", "A 5400-rpm drive maxes out around 80–100 MB/s. Windows and browsers assume SSD speeds now."));
	else if (diskPct != null && diskPct < 80 && t.diskHealth !== "failing") findings.push(finding("disk-ok", "Storage", "ok", t.diskKind === "nvme" ? "NVMe storage, healthy" : "Storage looks fine", diskPct ? `${diskPct}% used, no SMART alarms.` : "No storage alarms."));
	if (!t.online) {
		findings.push(finding("net-offline", "Network", "crit", "This device is offline", "The browser reports no network. Nothing else on this probe will look right until that is fixed."));
		fixes.push({
			title: "Restore a path to the network",
			why: "Every modern app assumes the internet is there.",
			steps: [
				"Toggle Wi-Fi off and on. If it is Ethernet, reseat the cable.",
				"Forget the network and join again.",
				"If a login page should appear (hotels, airports), open a blank browser tab to http://neverssl.com and wait for the portal."
			]
		});
	} else {
		if (t.wifiRssi != null && t.wifiRssi <= -78) {
			findings.push(finding("wifi-weak", "Network", t.wifiRssi <= -82 ? "crit" : "warn", `Wi-Fi signal is weak (${t.wifiRssi} dBm)`, "Below about −70 dBm, packets start to retry. Below −80, the radio is guessing. That looks like 'the internet is broken'."));
			fixes.push({
				title: "Move closer or change radios",
				why: "Software cannot fix a weak radio path.",
				steps: [
					"Stand within one room of the router and test again.",
					"If this is a public hotspot, switch to a phone hotspot for a minute. If that is stable, the lounge Wi-Fi is the problem — not the device.",
					"Forget the network, rejoin, and disable 'auto-join' on other SSIDs that fight it."
				]
			});
		}
		if (t.rttMs != null && t.rttMs >= 180) findings.push(finding("net-rtt", "Network", t.rttMs >= 350 ? "crit" : "warn", `Latency is ${Math.round(t.rttMs)} ms`, "Pages that 'spin' are usually waiting on a slow first hop, not a slow computer."));
		if (t.downlinkMbps != null && t.downlinkMbps > 0 && t.downlinkMbps < 2) findings.push(finding("net-slow", "Network", "warn", `Throughput about ${t.downlinkMbps} Mbps`, "That is enough for mail, not for video or cloud backups. Large pages will crawl."));
		if ((t.rttMs == null || t.rttMs < 80) && (t.downlinkMbps == null || t.downlinkMbps >= 10) && (t.wifiRssi == null || t.wifiRssi > -70)) findings.push(finding("net-ok", "Network", "ok", t.connectionType ? `Network ${t.connectionType}${t.downlinkMbps ? ` · ${t.downlinkMbps} Mbps` : ""}` : "Network path looks fine", t.rttMs != null ? `Round trip ${t.rttMs} ms.` : "The browser is online with no red flags."));
	}
	if (t.thermalThrottle || t.gpuTempC != null && t.gpuTempC >= 88 || t.cpuTempC != null && t.cpuTempC >= 90) {
		const where = t.gpuTempC != null && t.cpuTempC != null && t.gpuTempC >= t.cpuTempC ? `GPU ${t.gpuTempC}°C` : t.cpuTempC != null ? `CPU ${t.cpuTempC}°C` : t.gpuTempC != null ? `GPU ${t.gpuTempC}°C` : "thermal throttle";
		findings.push(finding("thermal", "Thermals", t.gpuTempC != null && t.gpuTempC >= 90 ? "crit" : "warn", `Overheating (${where})`, "The chip is slowing itself down to survive. After a few minutes it will stutter, then the driver may reset — which looks like a crash."));
		fixes.push({
			title: "Cool the machine before you replace parts",
			why: "Heat is the most common 'my PC is broken' that is not actually a broken part.",
			steps: [
				"Power off. Open the case or flip a laptop and clear dust from the vents with short bursts of air.",
				"Give the machine a hard surface and a few inches of air. Beds and couches block intakes.",
				t.gpu ? `Update the ${t.gpu} driver after it is cool. Old drivers panic first under heat.` : "Update graphics drivers after it cools.",
				"If it still hits 90°C in a game after a dust-out, the thermal paste or cooler is due."
			]
		});
	} else if (t.cpuTempC != null && t.cpuTempC < 75) findings.push(finding("thermal-ok", "Thermals", "ok", `CPU ${t.cpuTempC}°C`, t.gpuTempC != null ? `GPU ${t.gpuTempC}°C. No throttle.` : "No thermal throttle."));
	if (t.malwareIndicators && t.malwareIndicators.length) {
		findings.push(finding("adware", "Security", "crit", "This looks like adware, not a broken PC", t.malwareIndicators.join(" · ")));
		fixes.push({
			title: "Remove the hijack, then the leftovers",
			why: "Pop-ups and a changed homepage are almost never a hardware fault.",
			steps: [
				"Uninstall anything named optimizer, cleaner, coupon, PDF helper, or 'search protect' that you did not choose.",
				"In the browser: remove unknown extensions, then reset settings to default. Set the search engine back to Google, Bing, or DuckDuckGo by hand.",
				t.os === "Windows" ? "Run Windows Security (or Malwarebytes) a full scan. Restart when it finishes." : "Run Malwarebytes. On a Mac, also check Login Items and Profiles in System Settings.",
				"Change the passwords that were typed while this was installed, starting with mail and the bank."
			]
		});
	}
	if (t.extensionCount != null && t.extensionCount >= 10 && !t.malwareIndicators?.length) findings.push(finding("extensions", "Security", "warn", `${t.extensionCount} browser extensions`, "Each one sits on every page. A pile of them is a common source of hijacks and slowdowns."));
	if (t.pendingUpdates != null && t.pendingUpdates >= 20) {
		findings.push(finding("updates", "System", symptom === "boot" ? "crit" : "warn", `${t.pendingUpdates} updates waiting`, symptom === "boot" ? "A stuck update is the usual reason a Windows machine sits on spinning dots." : "Old patches often include the graphics and disk fixes people think they need new hardware for."));
		if (symptom === "boot" || t.pendingUpdates >= 30) fixes.push({
			title: "Let the pending update finish",
			why: "Half-applied Windows updates hang at the logo.",
			steps: [
				"Hold the power button 10 seconds. Power on and wait — 20 to 40 minutes is normal for a piled-up update. Do not keep force-restarting.",
				"If it is still looping: power on, interrupt three times to reach Repair, then Startup Repair.",
				"After it boots, install remaining updates in one sitting and restart until it says you are current."
			]
		});
	}
	if (t.cpuCores != null && t.cpuCores <= 2) findings.push(finding("cpu-dual", "CPU", symptom === "slow" ? "warn" : "info", `Only ${t.cpuCores} CPU cores`, "Dual-core machines fall over once a browser, mail, and a video call are open at once."));
	else if (t.cpuCores != null) findings.push(finding("cpu-ok", "CPU", "ok", `${t.cpuCores} cores`, t.cpuBenchMs != null ? `Probe workload finished in ${t.cpuBenchMs} ms.` : "CPU count is not the limiter."));
	if (t.cpuBenchMs != null && t.cpuBenchMs >= 90 && (t.cpuCores == null || t.cpuCores <= 4)) findings.push(finding("cpu-slow", "CPU", "warn", "CPU probe ran hot and slow", `A short math workload took ${t.cpuBenchMs} ms. On a healthy modern chip it is usually under 40 ms. Heat or an old dual-core will do this.`));
	if (t.startupItemCount != null && t.startupItemCount >= 15) findings.push(finding("startup", "System", "info", `${t.startupItemCount} startup items`, "A long login is almost always this list, not a dying motherboard."));
	if (t.batteryLevel != null && t.batteryLevel <= .15 && t.batteryCharging === false) findings.push(finding("battery-low", "Power", "info", `Battery at ${Math.round(t.batteryLevel * 100)}%`, "Some laptops silently underclock at this level. Plug in before you judge performance."));
	if (t.source === "live") findings.push(finding("probe-scope", "Scope", "info", "Browser probe — not a kernel agent", "This pass can see CPU cores, memory hints, GPU name, network, and storage estimates. It cannot read SMART data, installed programs, or temperatures on this device. For those, use the lab machines or have the owner describe the symptom."));
	if (symptom === "sound") {
		findings.push(finding("sound", "Audio", "warn", "Reported: no sound", "Hardware probes rarely catch this. It is almost always the wrong output device, a mute key, or a disabled exclusive-mode device."));
		fixes.push({
			title: "Force the correct output",
			why: "Windows and macOS love to route audio to a dead HDMI or Bluetooth sink.",
			steps: [
				"Check the mute key and the volume mixer.",
				t.os === "macOS" ? "Option-click the speaker in the menu bar. Pick Internal Speakers." : "Click the speaker on the taskbar. Pick the real speakers or headset, not 'NVIDIA output' or a TV that is off.",
				"Unplug and replug the headset. On Bluetooth, forget the device and pair again."
			]
		});
	}
	if (symptom === "display") {
		findings.push(finding("display", "Display", "warn", "Reported: screen trouble", t.gpu ? `GPU reports as ${t.gpu}. Flicker after 10–20 minutes is often a driver or a loose cable, not the panel.` : "Flicker, black screens, and wrong resolution are usually driver or cable, not the glass."));
		fixes.push({
			title: "Rule out cable and driver first",
			why: "Replacing a panel is expensive. Reseating a cable is free.",
			steps: [
				"Reseat HDMI/DisplayPort at both ends. Try another cable.",
				"Boot to the manufacturer's graphics driver page and install the current one — not Windows Update's.",
				"If the screen is black but you can hear Windows: try Win+Ctrl+Shift+B to reset the graphics driver."
			]
		});
	}
	if (symptom === "battery" && t.batteryLevel != null) {
		findings.push(finding("battery-health", "Power", "warn", "Reported: battery dies fast", "A browser probe cannot read cycle count. If it drops 20% in an hour on idle, the pack is the suspect — not Windows."));
		fixes.push({
			title: "Measure drain, then decide on a pack",
			why: "A tired battery looks like a slow computer because the chip underclocks.",
			steps: [
				t.os === "macOS" ? "Hold Option and click the battery. Note condition. System Settings → Battery → Battery Health." : "Open a Command Prompt and run: powercfg /batteryreport. Open the HTML file it writes to your user folder.",
				"Test with the charger in. If it is snappy on AC and dead on battery, replace the pack.",
				"Turn off wake-on-network and close leftover video-call apps. They pin the radio all night."
			]
		});
	}
	if (findings.every((f) => f.severity === "ok" || f.severity === "info") && symptom === "slow") {
		findings.push(finding("slow-software", "Software", "warn", "Hardware looks fine — this is software load", "Cores, memory, and network are not in the red. The lag is coming from too many tabs, a heavy page, or a stuck process — not a dying machine."));
		fixes.push({
			title: "Cut the working set in half",
			why: "A healthy PC still feels broken with 40 tabs and two video calls.",
			steps: [
				"Restart the browser. Keep one window.",
				t.os === "macOS" ? "Activity Monitor → CPU. Quit anything using more than 30% that you do not recognize." : "Task Manager → Processes. End tasks you do not need. Watch Disk — if it sits at 100%, that process is the story.",
				"Restart the computer once after that. If it is still slow on a clean boot, come back and send another probe."
			]
		});
	}
	const ranked = [...findings].sort((a, b) => SEV_RANK[b.severity] - SEV_RANK[a.severity]);
	const primary = ranked.find((f) => f.severity === "crit") || ranked.find((f) => f.severity === "warn") || ranked[0];
	const score = scoreOf(findings);
	const status = statusFromScore(score);
	const headline = !primary || primary.severity === "ok" ? "This machine looks healthy." : /[.!?]$/.test(primary.title) ? primary.title : `${primary.title}.`;
	const name = t.deviceName;
	const summary = buildSummary(t, primary, status, complaint, symptom);
	if (fixes.length === 0 && status === "healthy") fixes.push({
		title: "Keep it that way",
		why: "Nothing on this probe is on fire.",
		steps: [
			"Install pending updates on a night you can let it sit.",
			"Keep 15% of the disk free.",
			"If a person is still unhappy with it, the problem is an app — have them send another probe while it is misbehaving."
		]
	});
	return {
		score,
		status,
		headline: tidyHeadline(headline, status),
		summary: `${name}: ${summary}`,
		primaryArea: primary?.area ?? "System",
		findings: ranked,
		fixes: uniqueFixes(fixes)
	};
}
function tidyHeadline(headline, status) {
	if (status === "healthy" && !/healthy|fine|no faults/i.test(headline)) return "This machine looks healthy.";
	return headline;
}
function buildSummary(t, primary, status, complaint, symptom) {
	const asked = complaint || (symptom && symptom !== "other" ? SYMPTOM_LINE[symptom] : null);
	if (status === "healthy") return asked ? `Hardware is not the story. They said “${asked}” — look at software load and the network path, not a parts swap.` : "No critical faults. CPU, memory, storage, and network are inside normal range on this pass.";
	if (!primary) return asked ? `They reported “${asked}”. The probe did not pin a single hardware fault.` : "Mixed signals. Read the findings.";
	return `${asked ? `They reported “${asked}”. ` : ""}${primary.detail}`;
}
var SYMPTOM_LINE = {
	slow: "slow or laggy",
	offline: "can't get online",
	heat: "hot or loud",
	crash: "crashes or freezes",
	ads: "pop-ups",
	sound: "no sound",
	display: "screen trouble",
	battery: "battery dies fast",
	boot: "won't start"
};
function uniqueFixes(fixes) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const f of fixes) {
		if (seen.has(f.title)) continue;
		seen.add(f.title);
		out.push(f);
	}
	return out.slice(0, 4);
}
var SCAN_STEPS = [
	{
		id: "link",
		label: "Establishing link",
		log: "handshake ok · 1 hop"
	},
	{
		id: "hw",
		label: "Reading hardware",
		log: "enumerating cores, model, firmware"
	},
	{
		id: "mem",
		label: "Mapping memory",
		log: "walking committed pages"
	},
	{
		id: "disk",
		label: "Checking storage",
		log: "quota, wear, free space"
	},
	{
		id: "net",
		label: "Tracing network",
		log: "first hop · rtt · radio"
	},
	{
		id: "gpu",
		label: "Identifying graphics",
		log: "renderer string"
	},
	{
		id: "pwr",
		label: "Power and thermals",
		log: "battery · throttle flags"
	},
	{
		id: "sec",
		label: "Security posture",
		log: "extensions · startup · hijack signs"
	},
	{
		id: "corr",
		label: "Correlating symptoms",
		log: "matching complaint to evidence"
	},
	{
		id: "write",
		label: "Writing diagnosis",
		log: "scoring · ranking findings"
	}
];
function prefersReducedMotion() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function sleep(ms) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}
function parseBrowser(ua, nav) {
	const brand = nav.userAgentData?.brands?.find((b) => !/not/i.test(b.brand) && b.brand !== "Chromium");
	if (brand) return `${brand.brand} ${brand.version}`;
	if (/Edg\//.test(ua)) return `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1] ?? ""}`.trim();
	if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]?.split(".")[0] ?? ""}`.trim();
	if (/Firefox\//.test(ua)) return `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""}`.trim();
	if (/Safari\//.test(ua) && /Version\//.test(ua)) return `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] ?? ""}`.trim();
	return "Unknown browser";
}
function parseOs(ua, platform) {
	if (platform) {
		if (/mac/i.test(platform)) return { os: "macOS" };
		if (/win/i.test(platform)) return { os: "Windows" };
		if (/linux/i.test(platform)) return { os: "Linux" };
		if (/android/i.test(platform)) return { os: "Android" };
		if (/ios|iphone|ipad/i.test(platform)) return { os: "iOS" };
	}
	if (/Windows NT 10/.test(ua)) return {
		os: "Windows",
		osVersion: "10/11"
	};
	if (/Mac OS X/.test(ua)) return {
		os: "macOS",
		osVersion: ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".")
	};
	if (/Android/.test(ua)) return {
		os: "Android",
		osVersion: ua.match(/Android ([\d.]+)/)?.[1]
	};
	if (/iPhone|iPad/.test(ua)) return { os: "iOS" };
	if (/Linux/.test(ua)) return { os: "Linux" };
	if (/CrOS/.test(ua)) return { os: "ChromeOS" };
	return { os: platform || "Unknown OS" };
}
function gpuName() {
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
function cpuBench() {
	const t0 = performance.now();
	let x = 0;
	for (let i = 0; i < 14e5; i += 1) x += Math.sqrt(i & 255);
	const ms = performance.now() - t0;
	return Math.round((ms + x * 0) * 10) / 10;
}
async function readBattery() {
	const nav = navigator;
	if (typeof nav.getBattery !== "function") return null;
	try {
		return await nav.getBattery();
	} catch {
		return null;
	}
}
async function collectLiveTelemetry() {
	const nav = navigator;
	const ua = nav.userAgent || "";
	const conn = nav.connection;
	const mem = performance.memory;
	const uaData = nav.userAgentData;
	let high;
	try {
		high = await uaData?.getHighEntropyValues?.([
			"platform",
			"platformVersion",
			"model",
			"architecture"
		]);
	} catch {
		high = void 0;
	}
	const { os, osVersion } = parseOs(ua, high?.platform || uaData?.platform || nav.platform);
	const battery = await readBattery();
	let storageQuotaGb = null;
	let storageUsedGb = null;
	try {
		if (nav.storage?.estimate) {
			const est = await nav.storage.estimate();
			if (est.quota) storageQuotaGb = Math.round(est.quota / 1e9 * 100) / 100;
			if (typeof est.usage === "number") storageUsedGb = Math.round(est.usage / 1e9 * 1e3) / 1e3;
		}
	} catch {}
	const deviceName = high?.model && high.model.length > 1 ? high.model : `${os}${osVersion ? ` ${osVersion}` : ""} device`;
	return {
		source: "live",
		capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
		languages: [...nav.languages?.length ? nav.languages : [nav.language].filter(Boolean)],
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		touch: nav.maxTouchPoints > 0,
		cookiesEnabled: nav.cookieEnabled
	};
}
var SYMPTOMS = [
	{
		id: "slow",
		label: "Slow or laggy",
		hint: "Apps hitch, spinning wheels"
	},
	{
		id: "offline",
		label: "Can't get online",
		hint: "Wi-Fi drops, pages stall"
	},
	{
		id: "heat",
		label: "Hot or loud",
		hint: "Fans scream, chassis burns"
	},
	{
		id: "crash",
		label: "Crashes or freezes",
		hint: "Restarts, lockups"
	},
	{
		id: "ads",
		label: "Pop-ups or hijack",
		hint: "Strange search, extra toolbars"
	},
	{
		id: "sound",
		label: "No sound",
		hint: "Mute, missing device"
	},
	{
		id: "display",
		label: "Screen trouble",
		hint: "Flicker, black, wrong size"
	},
	{
		id: "battery",
		label: "Battery dies fast",
		hint: "Won't hold a charge"
	},
	{
		id: "boot",
		label: "Won't start",
		hint: "Stuck on logo or login"
	},
	{
		id: "other",
		label: "Not sure",
		hint: "Just run the probe"
	}
];
function ScanFlow({ targetName, skipSymptoms = false, presetTelemetry, defaultSymptom = null, onComplete, againLabel }) {
	const addReport = useReports((s) => s.addReport);
	const addReportRef = (0, import_react.useRef)(addReport);
	addReportRef.current = addReport;
	const [phase, setPhase] = (0, import_react.useState)(skipSymptoms ? "running" : "symptoms");
	const [symptom, setSymptom] = (0, import_react.useState)(defaultSymptom);
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [report, setReport] = (0, import_react.useState)(null);
	const [runId, setRunId] = (0, import_react.useState)(0);
	const seq = (0, import_react.useRef)(0);
	const onCompleteRef = (0, import_react.useRef)(onComplete);
	onCompleteRef.current = onComplete;
	const symptomRef = (0, import_react.useRef)(symptom);
	symptomRef.current = symptom;
	function reset() {
		setReport(null);
		setLogs([]);
		setStepIndex(0);
		setRunId((n) => n + 1);
		setPhase(skipSymptoms ? "running" : "symptoms");
	}
	(0, import_react.useEffect)(() => {
		if (phase !== "running") return;
		const my = seq.current += 1;
		let cancelled = false;
		setLogs([]);
		setStepIndex(0);
		(async () => {
			const delay = prefersReducedMotion() ? 0 : 360;
			const lines = [];
			for (let i = 0; i < SCAN_STEPS.length; i += 1) {
				if (cancelled || seq.current !== my) return;
				setStepIndex(i);
				lines.push(SCAN_STEPS[i].log);
				setLogs([...lines]);
				await sleep(delay);
			}
			if (cancelled || seq.current !== my) return;
			const telemetry = presetTelemetry ? {
				...presetTelemetry,
				capturedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : await collectLiveTelemetry();
			if (cancelled || seq.current !== my) return;
			const diagnosis = diagnose(telemetry, symptomRef.current);
			const next = {
				id: newId(),
				targetName,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				diagnosis,
				telemetry,
				symptom: symptomRef.current
			};
			addReportRef.current(next);
			setReport(next);
			setStepIndex(SCAN_STEPS.length);
			setPhase("done");
			await onCompleteRef.current?.(next);
		})();
		return () => {
			cancelled = true;
		};
	}, [
		phase,
		runId,
		presetTelemetry,
		targetName
	]);
	if (phase === "symptoms") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: targetName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl",
				children: "What is going wrong?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-lg text-sm text-muted",
				children: "Pick the closest match. The probe still reads the machine — this just aims it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2",
				children: SYMPTOMS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSymptom(s.id),
					className: cn("min-h-14 rounded-xl px-4 py-3 text-left shadow-border transition-[box-shadow,background-color] duration-[var(--motion-quick)] ease-[var(--ease-out)]", symptom === s.id ? "bg-elevated shadow-border-hover" : "bg-surface hover:shadow-border-hover"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium text-fg",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: s.hint
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "min-h-12",
					onClick: () => setPhase("running"),
					children: "Send probe"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "ghost",
					className: "min-h-12",
					onClick: () => {
						setSymptom(null);
						setPhase("running");
					},
					children: "Skip — just scan"
				})]
			})
		]
	});
	if (phase === "running") {
		const step = SCAN_STEPS[Math.min(stepIndex, SCAN_STEPS.length - 1)];
		const progress = (stepIndex + 1) / SCAN_STEPS.length * 100;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-4xl gap-10 lg:grid-cols-[auto_1fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reticle, {
				progress,
				live: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
						children: targetName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl text-fg",
						children: step.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-6 max-h-56 space-y-1 overflow-hidden font-mono text-xs text-muted",
						children: logs.filter((line, i) => i === 0 || line !== logs[i - 1]).map((line, i, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: i === arr.length - 1 ? "text-fg" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 text-subtle",
								children: "›"
							}), line]
						}, `${line}-${i}`))
					})
				]
			})]
		});
	}
	if (!report) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, {
		report,
		onAgain: reset,
		againLabel
	});
}
//#endregion
export { ScanFlow as t };
