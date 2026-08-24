# Research — Desktop Input Pipeline Latency Sentinel

## Topic
Detect and isolate AI desktop-agent regressions that degrade system-wide Windows input responsiveness.

## Category
Performance

## Problem
A desktop AI client can make mouse/keyboard delivery stutter across the operating system even when aggregate CPU/GPU utilization is not saturated. The regression is easy to misdiagnose as hardware or drivers and can survive minimization or idle state.

## Why it matters now
OpenAI Codex Windows reports in August 2026 show a cluster of independent reproductions across builds and hardware. Issue #38777 measured delivery gaps >8 ms rising from 0.055% after exit to 2.80% with Codex running (~50x). Issues #38663 and #38711 isolate pet/avatar overlay behavior and a 32 ms cursor synchronization path as a possible contributor. Issue #39450 shows severe lag while the agent is thinking on a later build, while #38554 and #38716 provide controlled run/exit A/B evidence.

## Affected users
Windows developers using AI desktop clients; platform engineers building Electron/WebView/native-overlay agents; release teams that benchmark app-local latency but not OS-wide input delivery.

## Current public evidence
### Observed evidence
1. openai/codex #38777 (2026-08-15): quantified system-wide input delivery stalls; >8 ms stall rate ~50x higher with Codex running, while probe-loop delay and overall CPU remained healthy.
2. #38663 (2026-08-14): enabling Pet reproducibly caused Windows-wide cursor stutter and disabling it immediately restored smooth movement.
3. #38711 (2026-08-15): diagnostics found a hidden avatar overlay, duplicate activity updates, background throttling disabled and a 32 ms cursor synchronization loop; the author labels this a possible contributor, not proven root cause.
4. #39450 (2026-08-19): a later build reproduced severe mouse lag during thinking despite moderate CPU, low DPC time and unsuccessful GPU-disable mitigation.
5. #38554 and #38716: controlled app-running versus fully-exited A/B reports show immediate recovery after process termination.

### Interpretation
The gap is observability and release gating. Utilization alone cannot detect input-delivery regressions. Teams need a direct A/B probe that measures event-delivery tails, correlates them with app state and blocks release on material regressions.

## Existing approaches
Task Manager resource checks, DPC/driver analysis, GPU toggles, restart, manual “feels laggy” testing and product-specific workarounds.

## Remaining limitations
CPU/GPU averages can look normal while events arrive late. Manual testing is subjective. Single samples cannot separate machine noise from application effect. Workarounds do not prevent regressions or localize root cause.

## Root-cause analysis
1. No system-input SLO in desktop-agent release tests.
2. Hidden/background overlays or polling loops can remain active outside visible UI.
3. App states such as thinking/task-switch/hidden-pet are not correlated with OS input metrics.
4. Resource dashboards emphasize utilization rather than event-delivery tails.
5. Controlled app-exited baselines are not mandatory before attribution.

## Improvement opportunity
Use a read-only Windows cursor-delivery probe plus deterministic analyzer. Capture baseline with app fully exited, capture affected state under a defined scenario, compare p95/p99/max gaps and >16 ms stall rate, isolate one variable at a time, then make the comparison a release gate.

## Goal / Metrics / Trigger / Inputs / Outputs
Goal: detect and prevent material input-latency regressions. Metrics: p95/p99/max gap, rates >8/16/32/64 ms, affected/baseline >16 ms ratio and repeatability. Trigger: release, stutter report, overlay/plugin change or runtime upgrade. Inputs: labeled baseline and affected JSONL traces. Outputs: deterministic pass/fail report and reasons.

## Relevant sources
- https://github.com/openai/codex/issues/38777
- https://github.com/openai/codex/issues/38663
- https://github.com/openai/codex/issues/38711
- https://github.com/openai/codex/issues/39450
- https://github.com/openai/codex/issues/38554
- https://github.com/openai/codex/issues/38716
