# Performance Engineering Rules

## Purpose
Control latency, throughput, memory, and compute cost without sacrificing quantitative correctness.

## Scope
Applies to research pipelines, real-time calculations, simulations, pricing, optimization, and execution services.

## MUST
- Performance requirements MUST be defined with representative workload, percentile, throughput, and resource constraints.
- Optimization claims MUST include before-and-after measurements under comparable conditions.
- Numerical equivalence or explicitly bounded error MUST be verified after performance changes.
- Hot paths MUST be identified by profiling rather than intuition alone.
- Capacity-sensitive systems MUST define overload behavior and resource ceilings.

## MUST NOT
- Correctness checks MUST NOT be removed solely to reduce latency without approved equivalent protection.
- Microbenchmarks MUST NOT be generalized to end-to-end production performance without supporting evidence.
- Parallelism MUST NOT introduce nondeterministic financial results where deterministic behavior is required.

## SHOULD
- Optimize algorithmic complexity and data movement before low-level tuning.
- Track latency distributions rather than averages alone.

## Exceptions
Exceptions require quantified business need, correctness evidence, risk, compensating controls, and accountable approval.

## Verification
Use profilers, representative benchmarks, load tests, numerical regression suites, resource metrics, and production telemetry. Compare p50/p95/p99 latency and throughput under equivalent datasets.