# Stream Processing Performance

## Purpose
Diagnose and improve throughput, latency, CPU, memory, network, and state performance using evidence.

## When to use
Use when SLOs regress, lag rises, costs spike, or capacity must increase.

## Inputs
Throughput/latency metrics, profiles, topology, partition counts, payload sizes, resource limits.

## Context to inspect
Serialization, batching, state access, network calls, GC, checkpoints, sinks, skew.

## Core knowledge
Streaming performance is pipeline performance; optimize the measured bottleneck, not isolated code. Tail latency, skew, checkpoint pauses, and downstream quotas frequently dominate averages.

## Procedure
1. Establish baseline and target.
2. Break end-to-end latency into stages.
3. Measure utilization, lag, skew, and service rates.
4. Profile hottest processor paths.
5. Inspect serialization and payload size.
6. Check state/checkpoint overhead.
7. Check external I/O and sink capacity.
8. Change one material variable at a time.
9. Benchmark representative and peak workloads.
10. Recheck correctness and cost.

## Decision points
Tune before scaling when inefficiency is proven; scale when workload parallelizes and bottleneck capacity grows accordingly.

## Common failure patterns
Optimizing averages; adding partitions despite sink bottlenecks; microbenchmarks unlike production; excessive batching that violates latency SLOs.

## Verification
Before/after benchmarks show statistically credible SLO improvement without correctness regressions.

## Expected output
Bottleneck evidence, changes, benchmark results, and capacity headroom.

## Stop conditions
Stop when production-like workload or telemetry is insufficient to identify the bottleneck safely.