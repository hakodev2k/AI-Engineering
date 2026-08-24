# Developer Tool Performance Rules
## Purpose
Control latency and resource costs that materially affect developer flow.
## Scope
Builds, tests, startup, code generation, analysis, IDE services, CI, and local tooling.
## MUST
- Performance claims MUST include representative before/after measurements.
- Critical workflows MUST define relevant latency or throughput indicators and monitor material regressions.
- Optimization MUST preserve correctness and diagnostic quality.
- Resource-intensive changes MUST assess CPU, memory, disk, and network impact where relevant.
## MUST NOT
- MUST NOT optimize from intuition alone when measurement is feasible.
- MUST NOT hide work asynchronously in a way that creates stale or incorrect results.
- MUST NOT improve median latency while ignoring severe tail regressions without explicit trade-off analysis.
## SHOULD
- Measurements SHOULD use representative repositories, machines, caches, and workload sizes.
- Budgets SHOULD focus on user-perceived critical paths.
## Exceptions
Temporary regressions require quantified impact, reason, owner, remediation plan, and approval when budgets are exceeded materially.
## Verification
Use benchmarks, profiles, traces, percentile telemetry, resource measurements, regression tests, and representative end-to-end timing.