# Inference Cost Optimization

## Purpose
Reduce the total cost of serving models while preserving required quality, latency, reliability, and operational headroom.

## When to use
Use when inference spend is growing, utilization is low, new hardware/runtime options are available, or unit economics must be improved.

## Inputs
Cloud or hardware costs, utilization, request/token distributions, model quality requirements, latency SLOs, replica counts, and benchmark results.

## Context to inspect
Inspect accelerator hourly cost, idle capacity, batching efficiency, model memory density, token generation length, cache hit rate, autoscaling behavior, network/egress, and fallback usage.

## Core knowledge
The useful unit is cost per successful request, token, or business outcome—not hourly accelerator price. Cheaper hardware can be more expensive if throughput is lower or additional replicas are required. Reliability headroom must remain explicit.

## Procedure
1. Define the unit-cost metric aligned to the product workload.
2. Attribute spend by model, hardware pool, region, and workload class.
3. Measure effective utilization and successful throughput.
4. Identify idle-capacity and overprovisioning sources.
5. Evaluate batching, quantization, routing, caching, and model-size options.
6. Compare candidate hardware on measured cost per target unit.
7. Tune autoscaling while retaining failure headroom.
8. Reduce unnecessary generated tokens or duplicated inference when product-safe.
9. Include operational, network, and fallback costs.
10. Validate savings under representative load and SLOs.
11. Track realized production savings after rollout.

## Decision points
Prefer higher-cost accelerators when they produce lower unit cost through substantially better throughput or density. Use smaller models when measured quality remains above requirement. Do not trade away required redundancy merely to improve utilization.

## Common failure patterns
Optimizing hourly price, measuring theoretical throughput, removing all warm capacity, ignoring egress and retries, and reducing precision or model size without quality evaluation.

## Verification
Verified means production-like tests and post-rollout telemetry show lower cost per successful unit while quality, latency, and availability stay within agreed thresholds.

## Expected output
Cost baseline, ranked optimization opportunities, unit-cost comparison, rollout evidence, and retained capacity headroom.

## Stop conditions
Escalate when cost attribution is unreliable, quality requirements are undefined, or proposed savings breach reliability or compliance constraints.