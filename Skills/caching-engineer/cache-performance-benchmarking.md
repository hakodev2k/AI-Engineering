# Cache Performance Benchmarking

## Purpose
Measure cache latency, throughput, resource use, and end-to-end benefit with representative workloads.

## When to use
Use before architecture changes, capacity decisions, client upgrades, or performance claims.

## Inputs
Workload model, key/value distributions, concurrency, network topology, SLOs.

## Context to inspect
Inspect production traffic distributions, object sizes, hit ratio, command mix, TLS, pooling, and deployment resources.

## Core knowledge
Synthetic single-command benchmarks can mislead. Cache performance depends on network RTT, serialization, pipelining, connection reuse, key distribution, value size, eviction, and server saturation. Tail latency matters more than maximum throughput.

## Procedure
1. Define hypothesis and success threshold.
2. Capture representative distributions.
3. Establish end-to-end baseline without the proposed change.
4. Warm cache deliberately unless cold behavior is under test.
5. Sweep concurrency and payload sizes.
6. Measure p50/p95/p99, throughput, CPU, memory, network, errors, and origin load.
7. Test saturation and recovery.
8. Repeat enough times to identify variance.
9. Compare cost per useful request, not raw operations only.
10. Preserve benchmark configuration and results.

## Decision points
Use microbenchmarks for isolated client/server questions and end-to-end load tests for architectural claims. Benchmark in topology resembling production when network dominates.

## Common failure patterns
Reporting averages; localhost-only results; unrealistic 100% hits; no serialization cost; comparing different warm-up states; ignoring errors at saturation.

## Verification
Results must be reproducible and tied to a stated workload and confidence range.

## Expected output
A benchmark report supporting or rejecting the proposed cache change.

## Stop conditions
Stop when workload assumptions are too different from production to support the decision.