# Performance Rules

## Purpose
Ensure performance work is evidence-based and protects latency, throughput, and resource efficiency.

## Scope
Applies to CPU, memory, allocation, database, network, serialization, and concurrency performance.

## MUST
- Performance requirements MUST identify relevant workload and measurable objectives.
- Optimization claims MUST include before/after measurements under comparable conditions.
- Hot paths MUST be identified from profiling, tracing, query evidence, or representative benchmarks rather than intuition alone.
- Capacity-sensitive changes MUST assess CPU, memory, thread, connection, and downstream effects.
- Benchmarks MUST control warm-up, dataset, concurrency, JVM version, and environment sufficiently for the conclusion claimed.

## MUST NOT
- MUST NOT trade correctness, security, or operability for speculative micro-optimization.
- MUST NOT extrapolate microbenchmark results directly to production without system-level validation.
- MUST NOT hide performance regressions by increasing timeouts without root-cause analysis.

## SHOULD
- Optimize the dominant bottleneck first.
- Track tail latency and saturation, not averages alone.

## Exceptions
Emergency mitigation may temporarily prioritize capacity over elegance, but requires rollback criteria and later validation.

## Verification
Use profilers, JFR or equivalent runtime evidence, load tests, query plans, metrics, traces, allocation data, and reproducible benchmarks.