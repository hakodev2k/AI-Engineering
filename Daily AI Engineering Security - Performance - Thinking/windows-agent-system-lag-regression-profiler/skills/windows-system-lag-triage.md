# Skill — Windows System-Lag Triage

## Purpose
Measure whether an AI desktop runtime correlates with system-wide responsiveness degradation and localize the dominant process/resource dimension before deeper tracing.

## Trigger
Mouse, keyboard, window switching, or desktop UI becomes sluggish while the agent app is open, thinking, idle, or after task completion.

## Inputs
Target process name, baseline scenario, affected scenario, sample interval/duration, optional input-stall measurements.

## Preconditions
Same machine/power mode/display setup; no destructive tests; normal data-protection policy remains active.

## Required context
App build, Windows build, GPU/driver, scenario, active features, and task state.

## Allowed tools
PowerShell process counters, Task Manager/Process Explorer, WPR/WPA for escalation, deterministic analyzer.

## Constraints
Read-only collection. Do not capture secrets. Do not change security settings to improve measurements.

## Procedure
1. Capture a quiet baseline with the target app in a known control state.
2. Capture the affected scenario with identical interval and duration.
3. Run `scripts/analyze_regression.py`.
4. Rank abnormal dimensions by p95 ratio and absolute threshold.
5. Form at most three hypotheses, such as CPU/polling, I/O loop, helper leak, or composition/GPU.
6. Perform one reversible discriminating A/B test per hypothesis.
7. If unresolved, escalate to ETW/WPR with the process/time window already narrowed.
8. Re-measure after a fix and run the same gate.

## Decision points
No baseline: stop. Too few samples: recollect once. Multiple dimensions abnormal: prefer experiments that separate them. No measurable regression: do not claim a performance fix.

## Expected output
Matched baseline/current report, dominant dimensions, evidence window, and next experiment.

## Metrics
p50/p95 resource metrics, stall ratio, recovery ratio, process persistence, false-positive rate.

## Verification
An independent engineer repeats the scenario or replays captured CSV through the analyzer and confirms tests/safety.

## Failure handling
One recollection for bad data; three hypothesis experiments; two implementation attempts; then escalate.

## Stop conditions
Unmatched environment, insufficient samples after recollection, inability to reproduce, or any proposed diagnostic that risks user data/security.
