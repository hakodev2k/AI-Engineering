# Messaging Performance Testing

## Purpose
Measure throughput, latency and stability under realistic messaging workloads before production limits are discovered by users.

## When to use
Use for capacity validation, tuning and regression analysis.

## Inputs
Workload model, payload distributions, topology, SLOs and infrastructure configuration.

## Context to inspect
Producer batching, acknowledgments, compression, partitions, consumer concurrency and downstream dependencies.

## Core knowledge
Benchmark end-to-end latency distributions and sustainable throughput, not broker-only peak numbers.

## Procedure
1. Define representative workload and success criteria.
2. Warm the system.
3. Measure baseline.
4. Increase load in controlled steps.
5. Capture p50/p95/p99 latency, throughput, lag, errors and resource saturation.
6. Test bursts and long soak periods.
7. Test dependency/broker degradation.
8. Change one tuning variable at a time.

## Decision points
Optimize only demonstrated bottlenecks; preserve durability guarantees unless requirements explicitly permit trade-offs.

## Common failure patterns
Tiny payload-only tests, short runs, coordinated omission and benchmarking without consumers.

## Verification
Repeat tests and compare statistically meaningful results against SLOs.

## Expected output
A reproducible benchmark with bottleneck evidence.

## Stop conditions
Stop when the environment is too unlike production to support the claimed conclusion.