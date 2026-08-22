# GraphQL Performance Investigation

## Purpose
Diagnose GraphQL latency and resource problems using execution evidence instead of optimizing individual resolvers by intuition.

## When to use
Use for high p95/p99 latency, database load, CPU spikes, timeout increases, or slow specific operations.

## Inputs
Operation traces, resolver spans, database/query metrics, downstream telemetry, schema, and traffic samples.

## Context to inspect
Inspect parse/validate time, query plan, resolver concurrency, DataLoader batches, database calls, network hops, serialization, response size, and cache behavior.

## Core knowledge
GraphQL latency emerges from the whole execution graph. A single request can amplify into many resolver and downstream calls. Optimize the measured critical path and work amplification, not merely the slowest-looking function.

## Procedure
1. Define the affected operation, percentile, and time window.
2. Capture an end-to-end trace.
3. Count resolver invocations and downstream calls.
4. Identify sequential waterfalls and N+1 patterns.
5. Inspect query plans and database indexes.
6. Measure payload and serialization cost.
7. Check concurrency saturation and pool limits.
8. Form one bottleneck hypothesis at a time.
9. Apply the smallest targeted change.
10. Re-run the same workload and compare percentiles and resource use.
11. Check regressions on other operations.

## Decision points
Batch when repeated keyed loads dominate; redesign schema/query boundaries when the graph inherently requires excessive hops. Cache only when reuse, staleness, and authorization semantics justify it.

## Common failure patterns
Optimizing averages, benchmarking different workloads, adding caches before locating cost, ignoring database plans, and measuring only resolver duration without call multiplicity.

## Verification
Provide before/after traces and load measurements showing improved target percentiles without correctness or resource regressions.

## Expected output
A root-cause-backed performance change with reproducible evidence.

## Stop conditions
Stop if representative telemetry cannot be obtained or production changes would be required without approval.