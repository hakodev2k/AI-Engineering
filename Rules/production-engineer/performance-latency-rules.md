# Performance and Latency Rules

## Purpose
Keep production performance within user and system requirements using measured evidence.

## Scope
Applies to request latency, throughput, CPU, memory, I/O, network behavior, and dependency performance.

## MUST
- Performance conclusions MUST be supported by representative measurements, traces, profiles, or benchmarks.
- Critical paths MUST define acceptable latency or throughput expectations at relevant percentiles and load levels.
- Performance regressions that threaten service objectives MUST be investigated before broad rollout.
- Optimization changes MUST record before-and-after evidence and verify correctness is preserved.

## MUST NOT
- MUST NOT claim an optimization from intuition or microbenchmarks that do not represent the affected workload.
- MUST NOT trade correctness, durability, or security for performance without explicit approval.
- MUST NOT optimize a downstream symptom while ignoring the measured bottleneck.

## SHOULD
- Prefer end-to-end measurements before local optimization.
- Track tail latency and saturation, not averages alone.

## Exceptions
Exceptions require documented constraint, evidence, risk, and approval where user or production safety is affected.

## Verification
Inspect benchmarks, load tests, profiles, traces, percentile dashboards, regression tests, and rollout telemetry.
