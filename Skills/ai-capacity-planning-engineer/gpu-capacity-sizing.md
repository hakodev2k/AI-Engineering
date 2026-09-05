# GPU Capacity Sizing

## Purpose
Translate AI workload demand into required GPU capacity while accounting for utilization targets, redundancy, fragmentation, and performance constraints.

## When to use
Use for new clusters, model launches, procurement, cloud reservations, or capacity shortfalls.

## Inputs
Model architecture, parameter count, precision, context lengths, throughput targets, latency SLOs, benchmark data, GPU types, memory limits, concurrency, redundancy policy.

## Preconditions
Use representative benchmark data for the exact or comparable model stack. Do not size solely from theoretical FLOPS.

## Context to inspect
Inference engine, tensor/pipeline parallelism, batching, quantization, KV-cache behavior, scheduler, GPU topology, MIG/partitioning, region and availability-zone design.

## Core knowledge
Real capacity depends on memory fit, effective utilization, communication overhead, batch efficiency, token mix, and tail-latency constraints. A GPU that is computationally faster may provide less useful capacity if memory or interconnect limits dominate.

## Procedure
1. Define capacity unit such as tokens/sec, requests/sec, or training samples/sec.
2. Benchmark representative workloads by GPU type.
3. Determine memory footprint and parallelism requirements.
4. Measure sustainable throughput at target latency.
5. Apply target utilization rather than peak benchmark utilization.
6. Add headroom for failures, deployments, and demand bursts.
7. Account for scheduler fragmentation and topology constraints.
8. Model N+1 or equivalent redundancy.
9. Compare multiple hardware options.
10. Document usable capacity per GPU and total required fleet.

## Decision points
Choose hardware based on cost-adjusted usable capacity and SLO compliance, not headline performance. Prefer larger-memory accelerators when model fit or KV cache is limiting.

## Common failure patterns
Ignoring memory, assuming 100% utilization, using synthetic benchmark peaks, forgetting failover reserve, and treating all GPUs as interchangeable.

## Verification
Run load tests at planned utilization and confirm latency, throughput, memory, and failover behavior.

## Expected output
A sizing model with GPUs required by workload, region, and redundancy tier.

## Stop conditions
Escalate when model benchmarks are unavailable or hardware topology assumptions are unverified.