# Autoscaling Inference

## Purpose
Design and tune autoscaling for model-serving workloads so capacity follows demand without excessive queueing, cold starts, or accelerator waste.

## When to use
Use for elastic online inference, bursty traffic, regional scaling, or when static replica counts create chronic overprovisioning or saturation.

## Inputs
Traffic history, queue depth, latency SLOs, startup time, replica capacity, GPU utilization, token throughput, cost targets, and failure assumptions.

## Preconditions
Per-replica capacity and startup behavior are measured under representative load.

## Context to inspect
Autoscaler signals, min/max replicas, cooldown, scale-up rate, pending capacity, scheduler behavior, quotas, and node provisioning latency.

## Core knowledge
CPU-style utilization metrics are often insufficient for AI serving. Queue depth, active sequences, token throughput, KV pressure, and latency can be more predictive. Slow model startup requires proactive headroom.

## Procedure
1. Establish safe per-replica capacity.
2. Select scaling signals correlated with saturation.
3. Define minimum warm capacity from recovery requirements.
4. Tune scale-up aggressively enough to absorb bursts.
5. Tune scale-down conservatively to avoid oscillation.
6. Include node provisioning and model warmup delay.
7. Test quota exhaustion and failed scale events.
8. Run burst and diurnal load scenarios.
9. Monitor queue time, cost, and replica utilization after rollout.

## Decision points
Use predictive or scheduled scaling for known demand patterns; use reactive scaling for unpredictable traffic with enough warm headroom.

## Common failure patterns
Scaling on average GPU utilization only, ignoring startup time, scale oscillation, and no capacity reserve for replica failure.

## Verification
Demonstrate SLO compliance through bursts and scale transitions while remaining within cost targets.

## Expected output
Autoscaling policy, signal thresholds, warm-capacity floor, and load-test evidence.

## Stop conditions
Escalate when infrastructure provisioning latency exceeds allowable recovery time.