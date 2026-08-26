# Performance Baseline and Benchmarking

## Purpose
Establish objective source performance and prove the target meets workload requirements before production cutover.

## When to use
Use before migration, during target sizing, after data load, and after cutover.

## Inputs
Source metrics, representative queries, workload traces, concurrency levels, SLOs, target configuration, and production data scale.

## Core knowledge
Benchmarks must represent workload shape, concurrency, data distribution, cache state, and tail latency. Average latency alone hides migration regressions.

## Procedure
1. Capture source throughput, p50/p95/p99 latency, CPU, memory, I/O, waits, locks, and connection usage.
2. Identify critical and expensive query families.
3. Build a replay or representative benchmark.
4. Load production-scale statistics and data distribution on target.
5. Benchmark cold and steady-state behavior where relevant.
6. Compare execution plans and wait profiles.
7. Tune target configuration and indexes based on evidence.
8. Repeat under expected peak concurrency.
9. Establish acceptance thresholds.
10. Preserve baseline for post-cutover comparison.

## Decision points
Tune queries when plans reveal inefficient access; scale resources when workload is efficient but capacity is insufficient. Avoid masking poor plans with hardware first.

## Common failure patterns
Tiny test datasets, single-user tests, average-only metrics, warmed-cache-only tests, and comparing unlike environments.

## Verification
Target meets defined latency, throughput, and resource-headroom thresholds under representative load.

## Expected output
Reproducible baseline, benchmark results, bottleneck evidence, and acceptance decision.

## Stop conditions
Stop cutover when critical workload SLOs are not met or benchmark representativeness is unproven.