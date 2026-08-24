# Backend Performance Investigation

## Purpose
Find and remove backend bottlenecks using profiling and production-representative measurements.

## When to use
Use for latency regressions, throughput limits, CPU/memory pressure, timeout growth, or capacity planning.

## Inputs
Latency distributions, throughput, profiles, traces, resource metrics, workload shape, service objectives.

## Context to inspect
Request path, database calls, network dependencies, serialization, allocations, thread/connection pools, caches, and infrastructure limits.

## Core knowledge
Queuing effects, tail latency, CPU vs I/O bottlenecks, profiling, allocation/GC behavior, contention, batching, caching, and load testing.

## Procedure
1. Define the performance objective and baseline.
2. Reproduce with representative data and concurrency.
3. Decompose latency by dependency and code segment.
4. Profile the dominant resource/bottleneck.
5. Rank improvements by expected impact and risk.
6. Change one dominant factor at a time.
7. Re-measure p50/p95/p99, throughput, and resource use.
8. Load-test saturation and recovery behavior.
9. Record capacity assumptions.

## Decision points
Optimize code only when profiling shows code cost; otherwise target database, network, concurrency, caching, or architecture. Scale out when bottlenecks parallelize and state permits it.

## Common failure patterns
Microbenchmarking irrelevant code, average-only latency, premature caching, unrealistic load, ignoring warm-up, and trading correctness for speed.

## Verification
Compare controlled before/after measurements and confirm no correctness, cost, or reliability regression.

## Expected output
Measured bottleneck analysis and verified improvement with capacity implications.

## Stop conditions
Stop when representative workload cannot be obtained or proposed optimization changes correctness/security guarantees.