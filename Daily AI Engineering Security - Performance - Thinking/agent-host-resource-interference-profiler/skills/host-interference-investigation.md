# Skill — Host Interference Investigation

## Purpose
Measure and diagnose workstation responsiveness degradation caused by an AI desktop/agent process family.

## Trigger
System-wide pointer/keyboard lag, UI stutter, unexplained idle CPU/I/O/memory growth, worker accumulation, or a desktop-agent version regression.

## Inputs
App/process name, build version, workload steps, baseline and affected probe outputs.

## Preconditions
Run on the affected host. Keep security tooling enabled. Record power/display state and whether an agent task is idle, active, or recently completed.

## Required context
Observable host/process metrics, app logs, build provenance, and reproducible workload only.

## Allowed tools
`scripts/windows_host_probe.ps1`, `scripts/analyze_probe.py`, Task Manager/Performance Monitor, app logs, OS process inspection, vendor issue tracker.

## Constraints
Do not disable endpoint protection, sandboxing, or approval controls to manufacture a pass. Do not attribute lag to CPU/GPU/I/O without synchronized evidence.

## Procedure
1. Record environment/build/workload metadata.
2. Capture clean baseline with the agent fully closed.
3. Launch the agent and reproduce a fixed workload.
4. Capture affected probe while the symptom is present.
5. Analyze with `analyze_probe.py` and compare p95/max gaps plus process metrics.
6. Classify the dominant signature: main-thread CPU, process churn, memory growth, read/write storm, GPU/compositor correlation, leaked workers, or unknown.
7. Form one measurable hypothesis.
8. Apply one bounded change.
9. Repeat the identical measurement.
10. Hand evidence to an independent benchmark reviewer.

## Decision points
- No measurable regression: gather a longer trace once; then stop rather than guessing.
- High jitter with low aggregate CPU: inspect main/UI thread, process churn, GPU/compositor and helper lifecycle.
- Large I/O/memory growth: profile responsible process family and long-lived caches/scans/logs.
- Regression disappears on full process termination: prioritize app process/lifecycle causes over unrelated driver theories.

## Expected output
Baseline, affected metrics, dominant signature, hypothesis, intervention, remeasurement, risks, and verification status.

## Metrics
p95/max gap, >64 ms stall count, CPU delta, working set, I/O deltas, process count, and before/after ratios.

## Verification
The target metric improves in a repeated same-machine workload and no required feature/security boundary was removed.

## Failure handling
Maximum two intervention iterations. Preserve raw probes and escalate with the smallest reproducible scenario.

## Stop conditions
Verified improvement, no reproducible measurable regression after two controlled attempts, or root cause requires vendor/runtime code unavailable to the investigator.
