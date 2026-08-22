# Performance Architecture

## Purpose
Shape architecture around measurable latency and throughput requirements while locating optimization effort where it has real impact.

## When to use
Use for latency-sensitive systems, high-throughput workloads, performance regressions, or architecture reviews.

## Inputs
Latency SLOs, traces, workload profile, dependency timings, data sizes, network topology, benchmarks.

## Preconditions
Critical journeys and performance targets are measurable.

## Context to inspect
End-to-end traces, database plans, serialization, network hops, caching, concurrency, queues, connection pools, resource saturation.

## Core knowledge
Performance is end-to-end. Amdahl’s law means optimizing a small component gives limited total benefit. Tail latency matters for user experience and distributed chains.

## Procedure
1. Establish baseline percentiles and throughput.
2. Decompose latency by component/dependency.
3. Identify dominant contributors and saturation points.
4. Challenge unnecessary network or persistence hops.
5. Evaluate caching only where staleness semantics are acceptable.
6. Reduce expensive data movement and serialization.
7. Review database access and indexes.
8. Review concurrency and connection limits.
9. Prototype high-risk optimizations.
10. Re-measure end-to-end under representative load.

## Decision points
Prefer architecture simplification before micro-optimization. Cache when repeated computation/data access is expensive and invalidation semantics are manageable.

## Common failure patterns
Average-only metrics, optimizing without baseline, cache-everything, ignoring tail latency, synthetic benchmarks detached from real workload.

## Verification
Before/after measurements demonstrate target improvement without correctness regressions.

## Expected output
Performance architecture decisions backed by traces and benchmarks.

## Stop conditions
Stop when no representative workload or measurements exist.