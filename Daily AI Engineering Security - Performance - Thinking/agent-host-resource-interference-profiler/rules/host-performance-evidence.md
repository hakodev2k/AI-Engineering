# Host Performance Evidence Rules

1. A performance investigation MUST capture a same-machine baseline before claiming a regression or improvement.
2. Baseline and affected measurements MUST use the same probe duration, sampling interval, power mode, display topology, and comparable foreground activity when practical.
3. The investigation MUST measure interactive latency/jitter in addition to aggregate CPU/RAM/disk/GPU counters.
4. Process-family measurements MUST include relevant child/helper processes when the runtime launches them.
5. A single Task Manager screenshot MUST NOT be treated as sufficient causal evidence.
6. The team MUST distinguish idle, active-agent, post-task, and long-idle states when the defect is time-dependent.
7. Optimization hypotheses MUST name the metric expected to change before implementation.
8. Only one major intervention SHOULD be tested per iteration unless the changes are inseparable.
9. Improvement MUST be demonstrated by remeasurement; subjective smoothness alone is insufficient.
10. Restarting the app MAY be used as a diagnostic control but MUST NOT be reported as a root-cause fix.
11. Security controls, approval gates, sandboxing, malware scanning, and endpoint protection MUST NOT be disabled merely to improve benchmark numbers.
12. Investigation loops MUST be bounded to two optimization iterations before hypothesis re-evaluation/escalation.
