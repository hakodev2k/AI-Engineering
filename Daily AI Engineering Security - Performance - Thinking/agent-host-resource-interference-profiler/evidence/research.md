# Research — Agent Host Resource Interference Profiler

## Topic
Host-level responsiveness regressions caused by AI desktop/agent runtimes.

## Category
Performance

## Problem
AI desktop agents can make the entire developer workstation stutter even when model responses remain fast and aggregate CPU/GPU/disk counters do not look saturated. The failure can originate in UI/main-process loops, GPU/DWM interaction, process respawn, native-host retry loops, runaway memory/I/O, or orphaned computer-use workers. Without host-responsiveness instrumentation, teams optimize the wrong layer or dismiss the problem as subjective UI lag.

## Why it matters now
A dense cluster of August 2026 Codex/ChatGPT Windows reports contains quantified, independently reproduced system-wide input latency and resource anomalies across multiple versions and machines. The reports show several different mechanisms producing the same user-visible symptom, so a reusable measurement-and-diagnosis procedure is more valuable than a single workaround.

## Affected users
Developers running desktop AI agents, Windows platform engineers, Electron/Chromium app teams, enterprise desktop administrators, and agent-runtime teams that launch browsers, MCP servers, computer-use workers, or repository processes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38777, opened 2026-08-15, reports system-wide mouse/keyboard input degradation and measured input-delivery stalls increasing by roughly 50× while Codex was running; killing Codex immediately resolved the symptom. https://github.com/openai/codex/issues/38777
2. Issue #38510, opened 2026-08-14, reports a Chrome native-host retry loop consuming a CPU core and causing input lag. https://github.com/openai/codex/issues/38510
3. Issue #38583 reports persistent system-wide mouse lag with about 10% CPU while idle and thread stacks concentrated in Chromium/V8. https://github.com/openai/codex/issues/38583
4. Issue #38710 reports sustained Codex GPU-process and Desktop Window Manager activity, approximately 2.64 GB working set, and system-wide lag despite low aggregate resource pressure. https://github.com/openai/codex/issues/38710
5. Issue #38506 reports a different affected machine reaching 6.4 GB memory and about 235 MB/s disk I/O with system-wide lag after an update. https://github.com/openai/codex/issues/38506
6. Issue #38702 reports the main process reaching roughly 1.1–1.5 GB/s read I/O after hours idle while the system became unresponsive. https://github.com/openai/codex/issues/38702
7. Issue #38714 links lingering computer-use `node_repl` workers after task completion with UI stalls. https://github.com/openai/codex/issues/38714
8. Issue #38720 reports dozens of computer-use processes spawning while idle on macOS, near-100% CPU, and severe system lag, showing the broader class is not purely a Windows input-driver problem. https://github.com/openai/codex/issues/38720

### Interpretation
The symptom is multi-causal. Aggregate utilization is insufficient: one hot UI thread, process churn, high I/O, GPU compositor interaction, or leaked workers can degrade interactive latency before the machine appears globally saturated. Diagnosis therefore needs synchronized host-responsiveness and process-family measurements plus controlled before/after experiments.

## Existing approaches
- Task Manager/Activity Monitor snapshots.
- Generic CPU, RAM, GPU, and disk monitoring.
- Restarting the desktop app.
- Driver updates and OS troubleshooting.
- App logs and crash reports.
- Per-process profilers used after the regression is already severe.

## Remaining limitations
- Point-in-time utilization does not measure interactive latency.
- Aggregate CPU can hide one saturated main/UI thread.
- A restart can mask a leak/loop without identifying the causal process or trigger.
- Users often change several variables at once, destroying comparison quality.
- Agent workloads create process trees; monitoring only the top-level process misses browser, MCP, computer-use, and helper workers.
- Performance claims are often made without a baseline from the same machine and workload.

## Root-cause analysis
1. Host responsiveness is not a first-class SLO for agent desktop software.
2. UI/main process, backend agent process, browser helpers, MCP servers, and computer-use workers have different failure modes but share one user-visible surface.
3. Long-lived sessions allow leaks/retry loops/process accumulation to build gradually.
4. Aggregate resource dashboards are optimized for saturation, not latency-sensitive interference.
5. Lacking synchronized measurements, correlation between process behavior and input stalls is weak.

## Improvement opportunity
Establish a repeatable host-interference benchmark: collect a clean idle baseline, run a fixed agent scenario, measure scheduler/input polling gaps and process-family counters at the same time, classify the dominant signature, apply one bounded intervention, and measure again. Store raw evidence so regressions can be compared across app releases.

## Proposed solution
This package provides a Windows probe, a cross-platform JSON analyzer, enforceable baseline/regression rules, an investigation skill, an independent benchmark reviewer, a bounded workflow, and a blocking regression hook.

## Goal
Detect and localize host-level responsiveness regressions before they become accepted as normal AI-agent overhead.

## Metrics
- p50/p95/p99/max probe gap in milliseconds
- count and ratio of gaps above 16.7 ms, 33.3 ms, and 64 ms
- process-family CPU delta
- working-set peak
- read/write byte deltas where available
- process count and orphan/worker count
- before/after p95 gap ratio
- regression pass/fail against explicit thresholds

## Trigger
Desktop-agent release validation, reports of system-wide lag, long-running sessions, new computer-use/MCP integrations, and performance regressions after upgrades.

## Inputs
Baseline probe JSON, affected probe JSON, thresholds, process name/filter, workload description.

## Outputs
Measured regression report, dominant signature, before/after comparison, and pass/fail exit status.

## Verification
Performance improvement is verified only when the same-machine, same-workload remeasurement reduces the targeted latency/resource metric without weakening security controls or disabling required functionality solely to make the benchmark pass.

## Relevant sources
- https://github.com/openai/codex/issues/38777
- https://github.com/openai/codex/issues/38510
- https://github.com/openai/codex/issues/38583
- https://github.com/openai/codex/issues/38710
- https://github.com/openai/codex/issues/38506
- https://github.com/openai/codex/issues/38702
- https://github.com/openai/codex/issues/38714
- https://github.com/openai/codex/issues/38720
