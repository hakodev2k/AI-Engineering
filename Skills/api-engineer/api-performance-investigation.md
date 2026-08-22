# API Performance Investigation

## Purpose
Diagnose API latency and throughput problems using evidence rather than speculative optimization.

## When to use
Use for slow endpoints, tail-latency regressions, capacity issues, or high resource consumption.

## Inputs
Latency metrics, traces, profiles, logs, traffic shape, query plans, and recent changes.

## Context to inspect
Gateway timing, application spans, database calls, remote dependencies, serialization, CPU, memory, and connection pools.

## Core knowledge
Percentiles matter more than averages. Decompose end-to-end latency before optimizing. Measure under representative concurrency and payloads.

## Procedure
1. Define the affected endpoint and SLO.
2. Reproduce or isolate the regression.
3. Compare p50/p95/p99 and throughput.
4. Trace request time across dependencies.
5. Inspect database and external-call latency.
6. Profile CPU/allocation only when evidence points there.
7. Form one measurable hypothesis.
8. Change one bottleneck at a time.
9. Benchmark before and after.
10. Check correctness and resource trade-offs.

## Decision points
Optimize the dominant bottleneck first; use caching only when freshness and invalidation costs are acceptable.

## Common failure patterns
Optimizing averages, microbenchmarking irrelevant code, adding cache blindly, and ignoring database/network time.

## Verification
Representative benchmarks show statistically meaningful improvement without correctness regression.

## Expected output
Root cause, evidence, remediation, and measured result.

## Stop conditions
Stop when production evidence is insufficient to distinguish competing causes.