# Performance Rules

- The investigation MUST capture an idle baseline before attributing lag to active agent work.
- Reports MUST include client version, OS, workload, sample interval, and raw trace location.
- Averages MUST NOT be the sole latency metric; p95 or p99 MUST be reported.
- Correlation MUST NOT be described as causation without a controlled isolation run.
- A restart MAY be used to compare state but MUST NOT be reported as root-cause remediation by itself.
- Security controls, sandboxing, endpoint protection, and permission boundaries MUST NOT be disabled to improve performance.
- A proposed optimization MUST be measured against the same workload at least three times.
- Completion MUST be blocked when configured thresholds regress beyond limits.
- Investigations SHOULD distinguish active-task and idle-task consumption.
- Retry loops MUST be bounded to three hypothesis/measurement cycles.
