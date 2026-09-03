# Performance and Capacity Planning

## Purpose
Size and tune event pipelines against throughput, latency, backlog, and recovery objectives.

## When to use
Use before production launches, growth events, broker changes, or performance investigations.

## Inputs
Ingress rates, message sizes, processing cost, partition count, latency SLO, retention, downstream capacity.

## Context to inspect
Peak percentiles, batch/prefetch settings, serialization, network, broker quotas, consumer CPU/memory, database/API limits, and autoscaling.

## Core knowledge
Throughput is constrained by the slowest stage. Average rates hide bursts and skew. Queueing delay rises rapidly near saturation. Recovery capacity must exceed ingress after an outage or backlog never drains.

## Procedure
1. Define end-to-end latency and throughput objectives.
2. Measure message-size and key distributions.
3. Benchmark producer, broker, consumer, and downstream stages separately.
4. Find sustainable service rate and saturation point.
5. Calculate partition and consumer concurrency needs.
6. Reserve headroom for bursts and recovery.
7. Tune batching only within latency limits.
8. Load-test realistic skew, retries, and outage recovery.
9. Establish capacity dashboards and growth thresholds.

## Decision points
Batch for throughput when added latency is acceptable; add partitions when parallelism is constrained by broker partitioning; optimize downstream before adding consumers if it is the bottleneck.

## Common failure patterns
Sizing from averages, ignoring message size, adding consumers against a saturated database, benchmarking without retries, and no recovery-capacity calculation.

## Verification
Peak and recovery tests meet SLOs with defined headroom and stable resource utilization.

## Expected output
Capacity model, bottleneck evidence, tuning decisions, and scaling thresholds.

## Stop conditions
Stop when production-like workload characteristics or downstream limits are unavailable.