# Performance Architecture

## Purpose
Design and evolve software so latency, throughput, and resource-efficiency requirements can be met predictably.

## When to use
Use when defining performance-sensitive architecture, investigating systemic slowness, or validating a major design change.

## Inputs
Latency targets, throughput, workload profile, traces, profiles, database metrics, network behavior, resource limits.

## Context to inspect
Critical paths, fan-out, serialization, database calls, caches, allocations, contention, queues, network hops, and infrastructure limits.

## Core knowledge
Performance is an end-to-end property. Optimize measured bottlenecks, not intuition. Tail latency often matters more than averages, and architectural fan-out can multiply slow dependencies.

## Procedure
1. Define measurable performance targets.
2. Trace representative critical paths.
3. Establish a baseline under realistic load.
4. Identify CPU, memory, I/O, database, network, or coordination bottlenecks.
5. Reduce unnecessary work and round trips.
6. Apply caching, batching, concurrency, indexing, or topology changes only where evidence supports them.
7. Re-measure after each material change.
8. Validate p95/p99 latency, throughput, saturation, and cost.
9. Add regression thresholds to performance tests.

## Decision points
Cache when repeated work and acceptable staleness justify complexity. Batch when throughput matters more than single-item latency. Scale only after confirming the constrained resource.

## Common failure patterns
Optimizing averages only, premature caching, unbounded parallelism, N+1 calls, excessive serialization, missing query plans, and performance tests with unrealistic data.

## Verification
Benchmark before and after using representative traffic and verify latency percentiles, throughput, resource usage, and correctness.

## Expected output
An evidence-backed performance design or improvement with quantified results and regression protection.

## Stop conditions
Stop when production-like workload data is unavailable or optimization would compromise correctness/security without approval.