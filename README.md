# SUPERSCOPE

One repo. Remote computer check for a dispatcher.

She gets one public link. No account. No install. No source dump. She taps **Allow**. We pull the report. We work the machine from here.

**Live probe:** [yorkie-probe.vercel.app](https://yorkie-probe.vercel.app)

`scope-probe` and `yorkie-probe` were leftover GitHub copies from the same night. Folded here. Archived.

## Layout

| Path | What |
|---|---|
| `src/` | Dispatcher board |
| `public/yorkie-probe.html` | Page she opens |
| `api/` | Report inbox and fix commands |
| `command.json` | Last command the open page polls |

## How it runs

1. Copy the public link.
2. She opens it on the sick PC and taps Allow.
3. The probe measures the box and sends the report home.
4. If the line is the problem, we send `fix-network`. Her page opens Windows Wi-Fi settings, retests, and reports back.

## Yorkie — last catch (2026-08-27)

Windows laptop. Chrome 151. 12 cores. 32 GB RAM. Intel Iris Xe.

| Reading | Result |
|---|---|
| First guess | 1.6 Mbps (Chrome lying) |
| After we measured | ~59 Mbps |
| Left | 250 ms first-hop latency |
| Verdict | Machine is fine. Line is fine for video. Remaining hitch is Wi-Fi hop, not a dead PC. |

## House law

- Nothing claimed that was not run.
- Speak like a night-shift floor man.
- Do not send a Grok preview URL. That demands a login she does not have.

Built by Everett Christman / The Christman AI Project.
