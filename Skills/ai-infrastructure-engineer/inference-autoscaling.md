# Inference Autoscaling

## Purpose
Design autoscaling for AI inference that responds to real demand without causing cold-start loops, GPU fragmentation, or SLO instability.

## When to use
Use for variable online inference traffic or services with expensive accelerator capacity.

## Inputs
Traffic patterns, latency SLOs, queue metrics, model load time, minimum replicas, GPU memory footprint, scaling limits.

## Context to inspect
Current scaling signals, warmup, batching, request concurrency, provisioning delay, cluster capacity, and rollback behavior.

## Core knowledge
GPU inference often scales poorly on CPU utilization. Queue depth, in-flight requests, token throughput, latency, and model-specific concurrency can be better signals. Scale-up delay must include node provisioning and model loading.

## Procedure
1. Establish baseline concurrency and saturation per replica.
2. Measure end-to-end scale-up and warmup time.
3. Select demand signals correlated with user impact.
4. Set minimum capacity for steady demand and failure headroom.
5. Configure scale-up aggressively enough to protect SLOs.
6. Configure scale-down conservatively to avoid thrashing.
7. Coordinate pod and node autoscaling.
8. Add capacity limits and admission control.
9. Load-test bursts, node shortages, and cooldown behavior.

## Decision points
Use predictive or scheduled capacity for known spikes; reactive scaling for uncertain traffic. Keep warm replicas when cold-start cost exceeds idle-cost tolerance.

## Common failure patterns
CPU-only scaling, scale-to-zero for large models with strict latency, oscillation, node autoscaler lag, and ignoring model load bandwidth.

## Verification
Verify p95/p99 latency, queue depth, scale latency, failure behavior, and cost across representative bursts.

## Expected output
A validated autoscaling policy and documented operating envelope.

## Stop conditions
Stop when reliable demand signals or model warmup behavior cannot be measured.