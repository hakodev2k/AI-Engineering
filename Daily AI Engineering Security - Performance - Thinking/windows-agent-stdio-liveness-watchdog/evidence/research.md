# Research Evidence

## Topic
Windows Agent stdio Liveness Watchdog

## Category
Performance

## Problem
Long-lived AI-agent child processes that communicate over stdio can remain alive while becoming non-functional after Windows power/lifecycle or pipe anomalies. A particularly costly failure mode is a post-suspend event loop spin: the process consumes approximately one CPU core indefinitely, serves no protocol traffic, and never exits, so the host has no normal process-death signal to trigger recovery.

## Why it matters now
On 2026-08-28 the official MCP Python SDK received issue #3411 describing two `stdio_server()` processes that were healthy before system sleep and immediately entered persistent ~100% core usage after resume while serving no further MCP traffic. Follow-up captures reproduced the behavior after short sleep cycles and showed the hot main thread inside the Windows asyncio event loop while worker threads remained idle. A selector-loop experiment did not remove the spin and instead exposed continuous self-pipe wakeups, suggesting the fault sits below ordinary MCP application logic. The issue was closed as not planned on 2026-09-01, leaving host-side detection/recovery valuable even when SDK code itself cannot safely fix the OS/runtime interaction.

## Affected users
Windows users of desktop coding agents, MCP stdio servers, local tool servers, AI IDEs, long-running agent daemons, and platform teams supervising agent child processes.

## Current public evidence

### Observed evidence
1. `modelcontextprotocol/python-sdk` issue #3411 (opened 2026-08-28) reports a FastMCP stdio server on Windows 10 / Python 3.13 / AnyIO 4.14.2 consuming ~98–100% of a core after suspend/resume while no longer serving MCP traffic. Two instances reproduced simultaneously and remained alive for nearly two hours.
2. Follow-up captures in #3411 showed the main event-loop thread active while the AnyIO stdin worker remained idle in `ReadFile`. Forcing `WindowsSelectorEventLoopPolicy` did not eliminate the post-resume spin; samples then showed the event loop self-pipe firing continuously. This weakens the obvious workaround of merely switching event-loop policies.
3. CPython issue 43346 documents a separate but related Windows subprocess liveness class where inherited pipe handles can cause timeout logic to block indefinitely. The details differ, but it demonstrates that process-alive status and high-level timeout intentions do not guarantee useful stdio/subprocess liveness on Windows.
4. OpenHarness issue #41 (2026-04-06) documents a Windows AI-agent TUI hanging indefinitely around subprocess pipe handling while a non-interactive mode worked, independently showing that Windows child-process/pipe failures remain an operational concern in agent tooling.

### Interpretation
The reusable engineering problem is not "fix one MCP loop." Agent hosts need a liveness contract stronger than `process exists`. Useful liveness requires bounded CPU behavior, recent protocol progress, responsive health/probe behavior when available, and restart escalation when a process is alive-but-wedged. Detection must avoid killing legitimately CPU-heavy tools, so multiple signals and a grace period are required.

### Proposed solution
A non-destructive watchdog analyzer that consumes timestamped process samples and protocol-progress timestamps, detects sustained high CPU plus stale progress (or sustained stale progress alone under stricter policy), and emits a recovery decision. The host can then terminate/restart only after deterministic thresholds and bounded verification. The reference script never kills processes itself.

## Existing approaches
- Let the MCP/agent host respawn a child only when it exits.
- Use generic OS process monitoring for CPU/memory.
- Switch Windows asyncio event-loop policy.
- Rely on request timeouts or pipe EOF.
- Manually kill the process after noticing resource use.

## Remaining limitations
- A wedged process may never exit, so exit-based supervision fails.
- CPU-only monitoring can false-positive on legitimate work.
- Request timeouts do not necessarily repair a broken child runtime and may not fire when no request is outstanding.
- The selector-loop experiment in #3411 did not fix the reported resume spin.
- Manual recovery is too slow for unattended agents and can leave multiple hot child processes consuming cores.

## Root-cause analysis
1. Host supervision equates OS process existence with service liveness.
2. stdio transports often lack an independent heartbeat channel.
3. Power-state transitions can invalidate runtime assumptions without delivering clean EOF/process termination.
4. Generic CPU monitors lack protocol-progress context.
5. Recovery behavior is not explicitly bounded or verified after restart.

## Improvement opportunity
Combine process CPU samples with protocol progress age and power-resume timestamps. Require sustained evidence across multiple samples, produce a reasoned restart recommendation, cap automatic restart attempts, and require a post-restart protocol handshake before declaring recovery.

## Goal
Reduce time and resource waste from alive-but-wedged Windows agent child processes without terminating healthy high-CPU work.

## Metrics
- Mean time to detect wedged child.
- CPU-core-minutes wasted after wedge onset.
- False-positive restart rate.
- Successful recovery rate after restart.
- Time from restart to verified protocol handshake.
- Restart attempts per incident.

## Trigger
Windows resume, child CPU anomaly, stale MCP/agent protocol progress, repeated request timeout, or unexplained local agent unresponsiveness.

## Inputs
Timestamped CPU-percent samples, last protocol-progress timestamp, optional resume timestamp, configured grace/window/thresholds, and restart attempt count.

## Outputs
`healthy`, `suspect`, or `restart_recommended` decision with evidence and metrics.

## Relevant sources
- MCP Python SDK issue #3411: https://github.com/modelcontextprotocol/python-sdk/issues/3411
- #3411 comments/captures: https://github.com/modelcontextprotocol/python-sdk/issues/3411#issuecomment-5464592202
- CPython issue 43346: https://bugs.python.org/issue43346
- OpenHarness issue #41: https://github.com/HKUDS/OpenHarness/issues/41
