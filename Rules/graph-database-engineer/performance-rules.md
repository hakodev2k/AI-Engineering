# Performance Rules

## Purpose
Make graph performance decisions from evidence and protect latency and throughput objectives.

## Scope
Queries, writes, traversals, algorithms, caching, memory, CPU, I/O, and capacity behavior.

## MUST
- Define representative datasets and workload shapes before performance conclusions are accepted.
- Support claimed improvements with comparable before/after measurements.
- Investigate query plans, cardinality, dense-node behavior, cache effects, and resource saturation for regressions.
- Establish latency and throughput objectives for critical workloads.

## MUST NOT
- Claim optimization from intuition or microbenchmarks unrelated to production shape.
- Optimize average latency while ignoring tail latency for user-critical paths.
- Benchmark against unrealistically small or sparse graphs when production is large or dense.

## SHOULD
- Track p50, p95, p99 latency and resource utilization together.
- Preserve benchmark scenarios for regression testing.

## Exceptions
Exploratory tuning may precede full benchmarking, but MUST be labeled provisional and verified before release decisions.

## Verification
Use repeatable benchmarks, query profiles, system metrics, cache statistics, load tests, and production telemetry. Record dataset scale, graph density, concurrency, hardware, configuration, and measurement method.