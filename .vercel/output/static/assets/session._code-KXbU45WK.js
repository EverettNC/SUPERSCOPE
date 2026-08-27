import{Q as e,X as t,c as n}from"./createLucideIcon-DvKOTg4G.js";import{a as r,i,n as a}from"./createServerFn-pHgfwRL_.js";import{t as o}from"./index-Bw5ijk18.js";import{r as s,t as c}from"./probes-C7puxrGf.js";import{n as l}from"./store-B3s8t0BB.js";import{i as u,n as d,r as f,t as p}from"./report-hz9S4OAv.js";var m=e(t());function h(e){return`scope-probe-${e}.html`}function g(e){let t=new Blob([_(e)],{type:`text/html;charset=utf-8`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=h(e),r.rel=`noopener`,document.body.appendChild(r),r.click(),r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),2e3)}function _(e){let t=JSON.stringify(e);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>Scope probe ${e.replace(/</g,``)}</title>
<style>
:root {
  --bg:#0b0c0e; --surface:#14161a; --fg:#eeeee8; --muted:#8d9198;
  --subtle:#6a6e76; --primary:#c5cdd8; --primary-fg:#0b0c0e;
  --ok:#8fad9a; --warn:#c4a574; --crit:#c17a72;
  --border:rgba(238,238,232,.12);
}
* { box-sizing:border-box }
html,body { margin:0; min-height:100%; background:var(--bg); color:var(--fg);
  font-family: ui-sans-serif, system-ui, "Segoe UI", sans-serif; line-height:1.5; }
body { background-image: radial-gradient(circle at center, rgba(238,238,232,.08) 1px, transparent 1px);
  background-size:22px 22px; }
.wrap { max-width:40rem; margin:0 auto; padding:1.5rem 1.25rem 4rem; }
.brand { font-family: ui-monospace, "SF Mono", Menlo, monospace; letter-spacing:.22em;
  font-size:.8rem; text-transform:uppercase; }
h1 { font-family: ui-serif, "Iowan Old Style", Palatino, serif; font-weight:400;
  font-size:clamp(2rem, 5vw, 3rem); line-height:1.1; margin:.75rem 0 0; text-wrap:balance; }
p { color:var(--muted); max-width:36rem; }
.muted { color:var(--muted); font-size:.9rem; }
.mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
button { font: inherit; cursor:pointer; border:0; border-radius:.7rem; min-height:2.75rem;
  padding:.6rem 1.1rem; font-weight:500; }
.primary { background:var(--primary); color:var(--primary-fg); }
.secondary { background:var(--surface); color:var(--fg); box-shadow:0 0 0 1px var(--border); }
.row { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1.75rem; }
.card { background:var(--surface); border-radius:.9rem; padding:1rem 1.1rem; box-shadow:0 0 0 1px var(--border); }
.find { display:flex; gap:.75rem; padding:.85rem 0; border-bottom:1px solid var(--border); }
.find:last-child { border-bottom:0; }
.dot { width:.45rem; height:.45rem; border-radius:99px; margin-top:.45rem; flex:none; }
.ok { background:var(--ok) } .warn { background:var(--warn) } .crit { background:var(--crit) } .info { background:var(--subtle) }
.score { font-family: ui-serif, Palatino, serif; font-size:2.4rem; }
.log { font-size:.8rem; color:var(--subtle); }
.hidden { display:none }
</style>
</head>
<body>
<div class="wrap">
  <p class="brand">Scope</p>
  <div id="consent">
    <h1>Someone wants to diagnose this computer.</h1>
    <p>Allowing reads what the browser can see: CPU cores, memory hints, GPU name, network, storage estimate. It does not install software, read your files, see passwords, or take control. You do not need an account.</p>
    <p class="mono muted">Probe ${e.replace(/</g,``)}</p>
    <div class="row">
      <button class="primary" type="button" id="allow">Allow scan</button>
      <button class="secondary" type="button" id="decline">Decline</button>
    </div>
  </div>
  <div id="declined" class="hidden">
    <h1>Declined.</h1>
    <p>Nothing was collected. You can close this page.</p>
  </div>
  <div id="running" class="hidden">
    <h1>Reading the machine.</h1>
    <p class="log" id="log">handshake ok</p>
  </div>
  <div id="done" class="hidden"></div>
</div>
<script>
const CODE = ${t};
const $ = (id) => document.getElementById(id);

$("allow").onclick = () => void run();
$("decline").onclick = () => { $("consent").classList.add("hidden"); $("declined").classList.remove("hidden"); };

function parseBrowser(ua, nav) {
  const brand = nav.userAgentData && nav.userAgentData.brands && nav.userAgentData.brands.find((b) => !/not/i.test(b.brand) && b.brand !== "Chromium");
  if (brand) return brand.brand + " " + brand.version;
  if (/Edg\\//.test(ua)) return "Edge";
  if (/Chrome\\//.test(ua)) return "Chrome";
  if (/Firefox\\//.test(ua)) return "Firefox";
  if (/Safari\\//.test(ua)) return "Safari";
  return "Unknown browser";
}
function parseOs(ua, platform) {
  const p = platform || "";
  if (/mac/i.test(p) || /Mac OS X/.test(ua)) return { os: "macOS" };
  if (/win/i.test(p) || /Windows/.test(ua)) return { os: "Windows" };
  if (/android/i.test(p) || /Android/.test(ua)) return { os: "Android" };
  if (/iphone|ipad|ios/i.test(p) || /iPhone|iPad/.test(ua)) return { os: "iOS" };
  if (/linux/i.test(p) || /Linux/.test(ua)) return { os: "Linux" };
  return { os: p || "Unknown OS" };
}
function gpuName() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      if (r) return r;
    }
    return gl.getParameter(gl.RENDERER) || null;
  } catch (e) { return null; }
}
function cpuBench() {
  const t0 = performance.now();
  let x = 0;
  for (let i = 0; i < 1400000; i++) x += Math.sqrt(i & 255);
  return Math.round((performance.now() - t0 + x * 0) * 10) / 10;
}
async function collect() {
  const nav = navigator;
  const ua = nav.userAgent || "";
  const conn = nav.connection || {};
  const mem = performance.memory;
  let high = {};
  try { high = await (nav.userAgentData && nav.userAgentData.getHighEntropyValues ? nav.userAgentData.getHighEntropyValues(["platform","platformVersion","model"]) : {}); } catch (e) {}
  const os = parseOs(ua, (high && high.platform) || (nav.userAgentData && nav.userAgentData.platform) || nav.platform);
  let battery = null;
  try { if (nav.getBattery) battery = await nav.getBattery(); } catch (e) {}
  let quota = null, used = null;
  try {
    if (nav.storage && nav.storage.estimate) {
      const est = await nav.storage.estimate();
      if (est.quota) quota = Math.round((est.quota / 1e9) * 100) / 100;
      if (typeof est.usage === "number") used = Math.round((est.usage / 1e9) * 1000) / 1000;
    }
  } catch (e) {}
  return {
    source: "live",
    capturedAt: new Date().toISOString(),
    deviceName: (high && high.model && high.model.length > 1) ? high.model : (os.os + " device"),
    os: os.os,
    osVersion: (high && high.platformVersion) || undefined,
    browser: parseBrowser(ua, nav),
    cpuCores: nav.hardwareConcurrency || null,
    deviceMemoryGb: typeof nav.deviceMemory === "number" ? nav.deviceMemory : null,
    jsHeapUsedMb: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
    jsHeapLimitMb: mem ? Math.round(mem.jsHeapSizeLimit / 1048576) : null,
    cpuBenchMs: cpuBench(),
    storageQuotaGb: quota,
    storageUsedGb: used,
    connectionType: conn.effectiveType || conn.type || null,
    downlinkMbps: typeof conn.downlink === "number" ? conn.downlink : null,
    rttMs: typeof conn.rtt === "number" ? conn.rtt : null,
    online: nav.onLine,
    gpu: gpuName(),
    screen: screen.width + "×" + screen.height,
    dpr: Math.round(devicePixelRatio * 100) / 100,
    batteryLevel: battery ? battery.level : null,
    batteryCharging: battery ? battery.charging : null,
    languages: [].slice.call(nav.languages || [nav.language]),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touch: nav.maxTouchPoints > 0,
    cookiesEnabled: nav.cookieEnabled,
  };
}
function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
function diagnose(t) {
  const findings = [];
  const fixes = [];
  const ramPct = t.ramUsedPct != null ? t.ramUsedPct : (t.jsHeapUsedMb != null && t.jsHeapLimitMb ? pct(t.jsHeapUsedMb, t.jsHeapLimitMb) : null);
  const diskPct = t.diskUsedPct != null ? t.diskUsedPct : (t.storageUsedGb != null && t.storageQuotaGb ? pct(t.storageUsedGb, t.storageQuotaGb) : null);
  if (t.deviceMemoryGb != null && t.deviceMemoryGb <= 4) {
    findings.push(["ram-low","Memory", t.deviceMemoryGb <= 2 ? "crit" : "warn", "Only " + t.deviceMemoryGb + " GB of RAM", "This machine will swap once a browser and a few apps are open."]);
  }
  if (ramPct != null && ramPct >= 88) {
    findings.push(["ram-pressure","Memory", ramPct >= 94 ? "crit" : "warn", "Memory is " + ramPct + "% full", "The machine is thrashing. New windows hitch because there is nowhere to put them."]);
    fixes.push(["Relieve memory pressure", "Quit the browser entirely and reopen only the tabs you need.", "Open Task Manager or Activity Monitor. Quit the heavy processes.", "Restart once after cleaning."]);
  }
  if (diskPct != null && diskPct >= 90) {
    findings.push(["disk-full","Storage", diskPct >= 95 ? "crit" : "warn", "Storage is " + diskPct + "% full", "Below 10% free, the OS has no room for scratch files and everything stutters."]);
    fixes.push(["Free 15% of the disk", "Empty the trash / recycle bin.", "Delete unused apps and old downloads.", "Move photos and video off the system drive."]);
  }
  if (!t.online) {
    findings.push(["net-offline","Network","crit","This device is offline","Nothing else on this probe will look right until there is a network path."]);
    fixes.push(["Restore a path to the network", "Toggle Wi-Fi off and on.", "Forget the network and join again.", "If this is a portal Wi-Fi, open a blank tab to a plain site and wait for the login page."]);
  } else {
    if (t.rttMs != null && t.rttMs >= 180) findings.push(["net-rtt","Network", t.rttMs >= 350 ? "crit" : "warn", "Latency is " + Math.round(t.rttMs) + " ms", "Pages that spin are usually waiting on a slow first hop, not a slow computer."]);
    if (t.downlinkMbps != null && t.downlinkMbps > 0 && t.downlinkMbps < 2) findings.push(["net-slow","Network","warn","Throughput about " + t.downlinkMbps + " Mbps", "That is enough for mail, not for video or cloud backups."]);
  }
  if (t.cpuCores != null && t.cpuCores <= 2) findings.push(["cpu-dual","CPU","warn","Only " + t.cpuCores + " CPU cores", "Dual-core machines fall over once a browser, mail, and a video call are open."]);
  if (t.cpuBenchMs != null && t.cpuBenchMs >= 90 && (t.cpuCores == null || t.cpuCores <= 4)) findings.push(["cpu-slow","CPU","warn","CPU probe ran hot and slow", "A short math workload took " + t.cpuBenchMs + " ms. On a healthy modern chip it is usually under 40 ms."]);
  if (t.batteryLevel != null && t.batteryLevel <= 0.15 && t.batteryCharging === false) findings.push(["battery-low","Power","info","Battery at " + Math.round(t.batteryLevel * 100) + "%", "Some laptops silently underclock at this level. Plug in before you judge performance."]);
  findings.push(["probe-scope","Scope","info","Browser probe — not a kernel agent", "This pass can see cores, memory hints, GPU name, network, and storage estimates. It cannot read SMART data or temperatures."]);
  const rank = { crit:4, warn:3, info:2, ok:1 };
  findings.sort((a,b) => rank[b[2]] - rank[a[2]]);
  let score = 100;
  findings.forEach((f) => { if (f[2]==="crit") score -= 28; else if (f[2]==="warn") score -= 12; else if (f[2]==="info") score -= 2; });
  if (findings.some((f) => f[2]==="crit")) score = Math.min(score, 52);
  if (findings.some((f) => f[0]==="net-offline")) score = Math.min(score, 34);
  score = Math.max(0, Math.min(100, score));
  const status = score >= 85 ? "healthy" : score >= 65 ? "fair" : score >= 40 ? "poor" : "critical";
  const primary = findings.find((f) => f[2]==="crit") || findings.find((f) => f[2]==="warn") || findings[0];
  const headline = !primary || primary[2]==="ok" ? "This machine looks healthy." : primary[3].replace(/[.!?]?$/, ".");
  if (!fixes.length) fixes.push(["Keep it that way", "Install pending updates on a night you can let it sit.", "Keep 15% of the disk free.", "If it still feels wrong, run this again while it is misbehaving."]);
  return {
    score, status, headline,
    summary: t.deviceName + ": " + (primary ? primary[4] : "No critical faults on this pass."),
    primaryArea: primary ? primary[1] : "System",
    findings: findings.map((f) => ({ id:f[0], area:f[1], severity:f[2], title:f[3], detail:f[4] })),
    fixes: fixes.map((f) => ({ title:f[0], why:"", steps:f.slice(1) })),
  };
}
function encodeTicket(ticket) {
  const json = JSON.stringify(ticket);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return "SCOPE1." + btoa(bin);
}
function copyText(text) {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly","");
  el.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.01";
  document.body.appendChild(el);
  el.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(el);
  if (ok) return Promise.resolve(true);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}
async function run() {
  $("consent").classList.add("hidden");
  $("running").classList.remove("hidden");
  const steps = ["handshake ok · 1 hop","enumerating cores","walking memory","quota and free space","first hop · rtt","renderer string","power flags","writing diagnosis"];
  for (let i = 0; i < steps.length; i++) {
    $("log").textContent = steps[i];
    await new Promise((r) => setTimeout(r, 280));
  }
  const telemetry = await collect();
  const diagnosis = diagnose(telemetry);
  const ticket = { v:1, code: CODE, telemetry, diagnosis };
  const payload = encodeTicket(ticket);
  const lines = [
    "SCOPE · " + telemetry.deviceName,
    diagnosis.score + " " + diagnosis.status.toUpperCase(),
    diagnosis.headline,
    diagnosis.summary,
    "",
    ...diagnosis.findings.map((f) => "[" + f.severity + "] " + f.area + " — " + f.title),
    "",
    "Send this whole message back, including the last line.",
    payload
  ];
  const report = lines.join("\\n");
  $("running").classList.add("hidden");
  const tones = { healthy:"ok", fair:"info", poor:"warn", critical:"crit" };
  $("done").classList.remove("hidden");
  $("done").innerHTML =
    '<p class="brand">Probe ' + CODE + '</p>' +
    '<div style="display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-top:1rem">' +
    '<h1 style="margin:0">' + diagnosis.headline + '</h1>' +
    '<div class="score">' + diagnosis.score + '</div></div>' +
    '<p>' + diagnosis.summary + '</p>' +
    '<p class="mono muted">' + diagnosis.status.toUpperCase() + " · " + diagnosis.primaryArea + " · " + telemetry.os + '</p>' +
    '<div style="margin-top:1.5rem">' + diagnosis.findings.map((f) =>
      '<div class="find"><span class="dot ' + f.severity + '"></span><div><div>' + f.title + '</div><div class="muted">' + f.detail + '</div></div></div>'
    ).join("") + '</div>' +
    '<div class="row"><button class="primary" type="button" id="copy">Copy report</button></div>' +
    '<p class="muted" id="copied"></p>';
  $("copy").onclick = async () => {
    const ok = await copyText(report);
    $("copied").textContent = ok ? "Copied. Send that text back — no account needed." : "Select the text below and copy it.";
    if (!ok) {
      const pre = document.createElement("textarea");
      pre.value = report;
      pre.style.cssText = "width:100%;min-height:10rem;margin-top:1rem;background:#14161a;color:#eeeee8;border:0;border-radius:.7rem;padding:.8rem;font:12px ui-monospace,monospace";
      $("done").appendChild(pre);
      pre.focus(); pre.select();
    }
  };
}
<\/script>
</body>
</html>`}function v(e){let t=e.trim().match(/SCOPE1\.([A-Za-z0-9+/=\s]+)/);if(!t?.[1])return null;try{let e=atob(t[1].replace(/\s/g,``)),n=Uint8Array.from(e,e=>e.charCodeAt(0)),r=new TextDecoder().decode(n),i=JSON.parse(r);return i?.v!==1||!i.code||!i.diagnosis||!i.telemetry?null:i}catch{return null}}var y=n();function b(){let{code:e}=o.useParams(),t=l(e=>e.addReport),[n,_]=(0,m.useState)(null),[b,x]=(0,m.useState)(`idle`),[S,C]=(0,m.useState)(!1),[w,T]=(0,m.useState)(``),[E,D]=(0,m.useState)(null),[O,k]=(0,m.useState)(null),A=(0,m.useRef)(0);(0,m.useEffect)(()=>{let t=!1,n;async function r(){try{let i=await s({data:{code:e}});if(t)return;if(i.ok){_(i.probe),i.probe.status!==`complete`&&(n=window.setTimeout(()=>void r(),1600));return}n=window.setTimeout(()=>void r(),4e3)}catch{t||(n=window.setTimeout(()=>void r(),4e3))}}return r(),()=>{t=!0,n&&window.clearTimeout(n),A.current&&window.clearTimeout(A.current)}},[e]),(0,m.useEffect)(()=>{S||n?.status===`complete`&&n.diagnosis&&n.telemetry&&(t({id:n.code,targetName:n.telemetry.deviceName||`Remote computer`,createdAt:n.createdAt,diagnosis:n.diagnosis,telemetry:n.telemetry,symptom:null,probeCode:n.code}),C(!0))},[t,n,S]);function j(e){A.current&&window.clearTimeout(A.current),x(e),A.current=window.setTimeout(()=>x(`idle`),2200)}function M(){g(e),j(`file`)}async function N(){await d(f(e))&&j(`note`)}async function P(){D(null);let n=v(w);if(!n){D(`That isn't a Scope report. Ask them to tap Copy report and send the whole thing.`);return}try{await c({data:{code:e,telemetry:n.telemetry,diagnosis:n.diagnosis}})}catch{}let r={id:n.code||e,targetName:n.telemetry.deviceName||`Remote computer`,createdAt:n.telemetry.capturedAt,diagnosis:n.diagnosis,telemetry:n.telemetry,symptom:null,probeCode:e};t(r),k(r),C(!0)}let F=O||(n?.status===`complete`&&n.diagnosis&&n.telemetry?{id:n.code,targetName:n.telemetry.deviceName||`Remote computer`,createdAt:n.createdAt,diagnosis:n.diagnosis,telemetry:n.telemetry,symptom:null,probeCode:n.code}:null);if(F)return(0,y.jsxs)(r,{children:[(0,y.jsx)(i,{}),(0,y.jsx)(p,{report:F})]});let I=!n||n.status===`waiting`;return(0,y.jsxs)(r,{children:[(0,y.jsx)(i,{}),(0,y.jsxs)(`div`,{className:`mx-auto grid max-w-4xl gap-10 lg:grid-cols-[auto_1fr] lg:items-start`,children:[(0,y.jsx)(u,{progress:I?8:48,live:!0}),(0,y.jsxs)(`div`,{children:[(0,y.jsx)(`p`,{className:`font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:I?`Waiting for them`:`Probe is running`}),(0,y.jsx)(`h1`,{className:`mt-2 font-display text-3xl text-fg sm:text-4xl`,children:I?`Send the probe.`:`Reading the machine.`}),(0,y.jsx)(`p`,{className:`mt-3 max-w-md text-sm text-muted`,children:I?`Download the file. Send it. They open it on the broken computer and tap Allow. No Grok account. No login. Nothing installs.`:`They allowed the scan. Findings will land here when the probe finishes.`}),(0,y.jsx)(`p`,{className:`mt-8 font-mono text-4xl tracking-[0.18em] text-fg`,children:e}),(0,y.jsxs)(`div`,{className:`mt-6 flex flex-col gap-3 sm:flex-row`,children:[(0,y.jsx)(a,{type:`button`,onClick:M,children:b===`file`?`Saved — send that file`:`Download ${h(e)}`}),(0,y.jsx)(a,{type:`button`,variant:`secondary`,onClick:()=>void N(),children:b===`note`?`Copied`:`Copy instructions`})]}),(0,y.jsxs)(`div`,{className:`mt-10`,children:[(0,y.jsx)(`label`,{htmlFor:`paste-report`,className:`font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:`Paste the report they send back`}),(0,y.jsx)(`textarea`,{id:`paste-report`,value:w,onChange:e=>T(e.target.value),placeholder:`SCOPE1.…`,rows:5,className:`mt-2 w-full resize-y rounded-lg bg-surface p-3 font-mono text-xs text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}),E?(0,y.jsx)(`p`,{className:`mt-2 text-sm text-crit`,children:E}):null,(0,y.jsx)(a,{type:`button`,variant:`secondary`,className:`mt-3`,onClick:()=>void P(),disabled:!w.trim(),children:`Load report`})]})]})]})]})}export{b as component};