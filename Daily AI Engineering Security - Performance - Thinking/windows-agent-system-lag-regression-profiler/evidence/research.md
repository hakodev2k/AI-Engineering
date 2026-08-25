# Research — Windows Agent System-Lag Regression Profiler

## Topic
Measure and isolate system-wide Windows input/UI degradation caused by desktop AI-agent runtimes.

## Category
Performance

## Problem
A desktop AI-agent process can degrade mouse/keyboard/UI responsiveness across Windows even when apparent application workload is modest. Conventional task-latency metrics miss this externalized cost, while Task Manager snapshots do not reliably localize the owning process or trigger.

## Why it matters now
A cluster of independent OpenAI Codex reports from 2026-08-14 through 2026-08-19 describes reproducible system-wide mouse/input lag after Windows desktop updates. Reports include a measured ~50x increase in input-delivery stalls, sustained CPU/GPU/DWM load, 1.1–1.5 GB/s read I/O while idle, hidden overlay/cursor-polling suspicion, persistent helper workers after task completion, and A/B recovery when the app, Pet, or Full access mode is disabled.

## Affected users
Developers running desktop coding agents on Windows; platform teams shipping Electron/native desktop agents; performance engineers; IT teams troubleshooting developer workstations.

## Current public evidence

### Observed evidence
1. Codex #38777, opened 2026-08-15, reports system-wide input latency with an approximately 50x increase in measured input-delivery stalls.
2. Codex #38711, opened 2026-08-15, reports system-wide mouse stutter with elevated main/renderer/GPU CPU and suspected hidden overlay cursor polling.
3. Codex #38710, opened 2026-08-15, reports active-thread lag and pointer flicker with sustained GPU/DWM load after the same update family.
4. Codex #38702, opened 2026-08-15, reports 1.1–1.5 GB/s read I/O and system-wide lag after hours idle.
5. Codex #38714, opened 2026-08-15, reports CUA `node_repl` workers persisting after Code Mode completion and correlating with UI stalls.
6. Codex #39450, opened 2026-08-19, independently reports severe mouse lag specifically while Codex is thinking.
7. Codex #38663, opened 2026-08-14/15, reports Pet-enabled mouse stutter that disappears immediately when Pet is disabled.

## Interpretation
There may be multiple root causes across builds: overlay polling/composition, helper lifecycle, I/O loops, renderer growth, or another subsystem. The common engineering gap is lack of a repeatable matched-baseline profiler that correlates responsiveness with process metrics and explicit scenario toggles.

## Existing approaches
Task Manager screenshots, ad-hoc Process Explorer/WPR traces, app restarts, disabling features, reinstall/rollback, or subjective cursor observation.

## Remaining limitations
Snapshots miss time correlation; subjective stutter is hard to compare; CPU alone can be low while input stalls are high; disabling the app proves association but not which subsystem owns the regression.

## Root-cause analysis
1. Desktop agents have multiple processes: main, renderer, GPU, helpers, and native hosts.
2. Background or hidden surfaces may remain active.
3. Child processes can outlive tasks.
4. High I/O, composition load, polling, or memory pressure can externalize latency system-wide.
5. Existing observability does not consistently bind metrics to scenario/control labels.

## Improvement opportunity
A reusable sampler/analyzer gives teams a baseline-first triage contract before expensive ETW/WPR tracing, ranks abnormal resource dimensions, and preserves evidence for escalation.

## Proposed solution
Provide a safe Windows sampler plus deterministic analyzer. Capture baseline and affected scenarios with process CPU, working set, read/write byte deltas, handle/thread counts, and an externally supplied input-stall metric when available. Compare median/p95 resource and stall ratios, require matched controls, and refuse causal conclusions when evidence is insufficient.

## Goal
Reduce workstation-impact regressions and shorten localization time without speculative fixes or unsafe system changes.

## Metrics
Input-stall p95 when available; CPU; read/write MB/s; working set; handles; threads; process count; idle-vs-active ratio; recovery ratio after feature/app disable.

## Trigger
System-wide pointer/keyboard/UI lag while an AI desktop runtime is idle, thinking, using computer-use/code mode, or after a long task.

## Inputs
CSV samples from `scripts/collect_agent_process_metrics.ps1`, scenario labels, optional externally measured input-stall milliseconds.

## Outputs
JSON comparison report and blocking regression status.

## Relevant sources
- https://github.com/openai/codex/issues/38777
- https://github.com/openai/codex/issues/38711
- https://github.com/openai/codex/issues/38710
- https://github.com/openai/codex/issues/38702
- https://github.com/openai/codex/issues/38714
- https://github.com/openai/codex/issues/39450
- https://github.com/openai/codex/issues/38663
