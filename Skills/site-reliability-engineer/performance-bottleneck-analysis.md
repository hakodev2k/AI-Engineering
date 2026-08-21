# Performance Bottleneck Analysis

## Purpose
Diagnose latency and throughput degradation using evidence, then remove the dominant constraint without shifting failure elsewhere.

## When to use
Use when latency SLOs regress, throughput plateaus, resource saturation rises, queues grow, or production behavior differs from lower environments.

## Inputs
Latency percentiles, traces, profiles, resource metrics, database statistics, queue metrics, traffic shape, recent changes, and dependency timing.

## Preconditions
A reproducible workload or representative production telemetry must exist.

## Context to inspect
Request path, serialization, thread/worker pools, CPU, memory/GC, network, database queries, indexes, cache behavior, locks, connection pools, external APIs, and async queues.

## Core knowledge
Performance is governed by the slowest constrained stage. Tail latency matters more than averages for user experience. Queueing, contention, fan-out, retries, and saturation can amplify small slowdowns into large end-to-end regressions.

## Procedure
1. Define the exact degraded metric and affected workload.
2. Compare current behavior with a known-good baseline.
3. Segment latency by endpoint, dependency, region, version, and workload class.
4. Use traces to identify time concentration.
5. Check saturation and queueing at each suspected stage.
6. Profile application CPU/allocation when process time dominates.
7. Inspect database execution and external dependency latency where relevant.
8. Form one measurable bottleneck hypothesis at a time.
9. Change the smallest causal factor.
10. Benchmark or canary the change under representative load.
11. Confirm the bottleneck is removed without causing a new constraint.

## Decision points
Optimize code only when application execution is material. Scale when demand exceeds efficient capacity and architectural optimization is not timely. Cache only when consistency and hit-rate characteristics make it effective.

## Common failure patterns
Optimizing averages, tuning without profiling, adding cache to hide slow queries, ignoring retry amplification, testing unrealistic load, and declaring success after moving saturation downstream.

## Verification
Compare before/after percentile latency, throughput, resource utilization, error rate, and downstream saturation under the same workload.

## Expected output
Evidence-backed bottleneck diagnosis, implemented mitigation, benchmark results, and remaining capacity risks.

## Stop conditions
Escalate when remediation requires major architecture change, production-only experimentation with unacceptable risk, or dependency changes outside team authority.