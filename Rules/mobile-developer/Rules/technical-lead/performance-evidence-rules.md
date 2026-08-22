# Performance Evidence Rules
## Purpose
Prevent speculative optimization and undetected performance regressions.
## Scope
Latency, throughput, resource usage, database, network, and scalability decisions.
## MUST
- Performance claims MUST be supported by reproducible measurements representative of the relevant workload.
- Material optimization MUST preserve correctness and compare before/after evidence.
- Performance-sensitive changes MUST identify the constrained resource or bottleneck.
## MUST NOT
- Claim improvement from code inspection alone when measurement is feasible.
- Optimize a local metric while ignoring end-to-end user or system impact.
## SHOULD
- Define budgets or SLO-aligned targets for critical paths.
## Exceptions
Preventive design without benchmark evidence must be identified as risk mitigation, not measured improvement.
## Verification
Inspect benchmarks, profiles, query plans, telemetry, load tests, and comparison methodology.