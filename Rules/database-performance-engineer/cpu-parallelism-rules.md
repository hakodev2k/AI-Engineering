# CPU and Parallelism Rules
## Purpose
Use compute and parallel execution efficiently without destabilizing mixed workloads.
## Scope
CPU saturation, worker scheduling, query parallelism, and compute scaling.
## MUST
- Correlate CPU usage with runnable work, query plans, throughput, and latency before tuning parallelism.
- Test parallelism changes against both target queries and concurrent workload fairness.
- Identify whether high CPU represents useful work, plan inefficiency, spin, compilation, or contention.
## MUST NOT
- Disable or maximize parallelism globally to fix one query without system-level evidence.
- Claim CPU optimization from lower utilization if throughput or latency regresses.
## SHOULD
- Reserve compute headroom for bursts, failover, and maintenance.
## Exceptions
Per-workload overrides may be used when scope and impact are measurable and isolated.
## Verification
Review CPU and scheduler telemetry, plans, worker waits, concurrency benchmarks, and service-level metrics.