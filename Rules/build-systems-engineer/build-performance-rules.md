# Build Performance Rules

## Purpose
Improve build latency and throughput through measurement rather than intuition.

## Scope
Applies to local builds, CI builds, remote execution, dependency analysis, caching, scheduling, and critical-path optimization.

## MUST
- Performance claims MUST be supported by before-and-after measurements using representative workloads.
- Build timing MUST distinguish analysis, queueing, execution, I/O, transfer, and test time where possible.
- Critical-path regressions above agreed thresholds MUST be investigated before broad rollout.
- Optimizations MUST preserve build correctness and reproducibility.
- Performance experiments MUST record workload, machine or worker class, cache state, and configuration.

## MUST NOT
- MUST NOT optimize solely for aggregate CPU utilization when wall-clock latency is the target outcome.
- MUST NOT hide slower clean builds behind improved warm-cache numbers.
- MUST NOT remove correctness checks merely to reduce build time.

## SHOULD
- Performance baselines SHOULD cover clean, incremental, no-op, and cache-assisted scenarios.
- High-frequency developer workflows SHOULD receive priority when deciding optimization work.

## Exceptions
A temporary regression MUST document business justification, expected duration, affected users, and mitigation.

## Verification
Use reproducible benchmarks, build traces, critical-path analysis, CI telemetry, and regression thresholds. Review both latency distributions and total resource cost.