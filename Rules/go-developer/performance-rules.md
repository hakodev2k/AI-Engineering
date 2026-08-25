# Performance Rules

## Purpose
Make performance decisions from evidence while protecting correctness.

## Scope
CPU, allocations, latency, throughput, contention, I/O, serialization, and hot paths.

## MUST
- Performance changes MUST define the metric and compare before/after evidence.
- Optimization MUST preserve correctness and relevant concurrency guarantees.
- Hot-path conclusions MUST use representative benchmarks, profiles, traces, or production metrics.
- Resource limits MUST account for downstream capacity.

## MUST NOT
- MUST NOT claim improvement from microbenchmarks that do not represent the affected workload.
- MUST NOT trade away safety or maintainability for unmeasured gains.
- MUST NOT optimize speculative bottlenecks before identifying material cost.

## SHOULD
- Use Go benchmarks and pprof to locate CPU and allocation hotspots.
- Include realistic payload sizes and concurrency in performance tests.

## Exceptions
Preventive optimization is acceptable for proven algorithmic bounds; document the risk being avoided.

## Verification
`go test -bench`, benchstat-equivalent comparison, pprof, traces, load tests, and production metrics.