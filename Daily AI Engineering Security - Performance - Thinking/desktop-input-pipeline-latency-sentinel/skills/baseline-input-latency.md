# Skill: Baseline Windows Input Delivery

## Purpose / Trigger
Measure whether a desktop AI client changes system-wide cursor event delivery rather than guessing from utilization. Trigger on release validation, reported input stutter, overlay/plugin change or desktop runtime upgrade.

## Inputs / Preconditions / Required context
Inputs: scenario label, duration, app-exited and app-on states, thresholds. Use the same machine/session/input device and similar pointer movement. Required context: exact app build, Windows build and scenario; conversation content is unnecessary.

## Allowed tools / Constraints
Allowed: `scripts/input_latency_probe.py`, `scripts/analyze_input_trace.py` and read-only performance counters. MUST capture an app-exited baseline. MUST NOT infer root cause from correlation alone. Traces SHOULD contain only timing, coordinates and labels.

## Procedure
1. Fully exit candidate app; collect 15–30 s baseline while continuously moving pointer.
2. Launch app and reproduce one defined state; collect affected trace.
3. Analyze the A/B pair.
4. Repeat up to 3 pairs if noisy.
5. If reproducible, isolate one variable at a time: overlay, plugin, thinking state, task switch, hidden renderer.
6. Form a hypothesis only after measurement.
7. Re-run identical A/B protocol after change.

## Decision points / Expected output
Fail when thresholds are exceeded or baseline is missing. A single noisy failure SHOULD be repeated unless severity makes continuation unsafe. Output tail metrics, A/B ratio, scenario and verification status.

## Metrics / Verification / Failure / Stop
Measure p95/p99/max gap, >16 ms rate, regression ratio and repeatability. Improvement requires affected measurements within thresholds with no security/functionality regression. Insufficient events can be recollected at most 3 times. Stop immediately if desktop becomes unusable.
