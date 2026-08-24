# Capacity and Performance Engineering

## Purpose
Diagnose and plan data-platform performance using measured bottlenecks, workload models, and capacity margins rather than reactive scaling.

## When to use
Use for slow pipelines/queries, rising queues, resource saturation, growth planning, or major workload launches.

## Inputs
Profiles, metrics, query/job plans, workload forecasts, concurrency, data size, SLOs, and cost data.

## Context to inspect
CPU, memory, disk, network, shuffle, queueing, partitions, caches, autoscaling, quotas, and historical peaks.

## Core knowledge
Throughput, latency, concurrency, and utilization interact through queueing. Scaling one resource cannot fix a bottleneck elsewhere. Benchmarking must represent production data shape, skew, and concurrency.

## Procedure
1. Define the violated performance objective.
2. Capture baseline latency, throughput, utilization, and queue time.
3. Decompose time across storage, compute, network, scheduling, and dependencies.
4. Profile representative workloads and inspect execution plans.
5. Identify the limiting resource and skew.
6. Apply the smallest justified change: query/layout tuning, concurrency control, caching, resource sizing, or scaling.
7. Benchmark under realistic concurrency.
8. Build growth forecasts and capacity headroom.
9. Add saturation and leading-indicator alerts.
10. Recheck cost per useful unit of work.

## Decision points
Scale up when single-task resource limits dominate; scale out when work parallelizes and coordination overhead remains acceptable. Optimize data layout before adding compute when scan amplification is the cause.

## Common failure patterns
Adding nodes before profiling, synthetic tiny benchmarks, ignoring queue time, caching low-reuse data, autoscaling too slowly for bursts, and treating average utilization as peak capacity.

## Verification
Compare before/after profiles, run load tests at target concurrency, validate SLO headroom and failure behavior, and confirm cost does not regress disproportionately.

## Expected output
Bottleneck evidence, tuned configuration/design, benchmark results, capacity model, alerts, and documented trade-offs.

## Stop conditions
Stop when representative load cannot be reproduced safely, production changes require unavailable privileges, or evidence contradicts the assumed bottleneck.