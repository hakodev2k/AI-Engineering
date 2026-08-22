# Skill: Mobile Performance and Reliability
Purpose: keep critical flows responsive and stable on realistic devices and networks.

Trigger: startup, scrolling, media, large lists, background work, memory pressure, crash/ANR, battery, or regression concerns.
Inputs: target device matrix, performance budget, traces/profiles, crash data, network behavior.
Procedure:
1. Define user-centric budgets for startup, interaction latency, memory, network, and failure rate.
2. Reproduce on representative low/mid/high devices and release-like builds.
3. Measure before optimizing; isolate CPU, main-thread, I/O, allocation, rendering, network, or contention causes.
4. Reduce work, frequency, payload, allocations, wakeups, and blocking paths before micro-optimizing.
5. Verify behavior under memory pressure, background/foreground transitions, low storage, slow network, timeout, and process death.
6. Add regression evidence and telemetry.
7. Bound retries and background jobs.
Output: baseline, bottleneck evidence, change, before/after result, regression test, residual risk.
Quality gate: no claimed improvement without comparable evidence.
Stop: budget passes or an explicit risk acceptance exists.