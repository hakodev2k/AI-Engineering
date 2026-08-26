# Autoscaling and Admission Control

## Purpose
Scale serving capacity and reject excess work predictably before queues or memory collapse.

## When to use
Use for variable traffic, burst handling, multi-tenant serving, or recurrent overload.

## Inputs
SLOs, traffic history, queue metrics, startup time, capacity per replica, quotas, hardware provisioning latency.

## Context to inspect
Autoscaler signals, scheduler, queue, model warmup, cluster capacity, priority classes, rate limits, and retry behavior.

## Core knowledge
GPU serving scales slower than stateless CPU services because accelerators are scarce and model loading is expensive. Queue depth, active tokens, KV pressure, and predicted demand are often better signals than raw GPU utilization. Admission control protects useful work during saturation.

## Procedure
1. Measure per-replica capacity by workload class. 2. Define overload thresholds tied to SLOs. 3. Select scaling signals and smoothing windows. 4. Account for provisioning plus model-load delay. 5. Maintain minimum warm capacity where justified. 6. Define per-tenant quotas and priority. 7. Reject early when safe capacity is unavailable. 8. Return retry guidance only when retries are likely to succeed. 9. Test bursts, scale-out lag, scale-in, and regional capacity loss. 10. Tune from production telemetry.

## Decision points
Use predictive scaling for regular demand patterns; reactive scaling for unpredictable traffic. Prefer shedding low-priority work over letting all requests miss SLOs.

## Common failure patterns
Scaling on utilization alone, unlimited queues, retry storms, aggressive scale-in, ignoring cold-start time, and admitting work beyond KV capacity.

## Verification
Demonstrate bounded queueing and stable p99 latency during burst/load tests, including delayed scale-out.

## Expected output
Autoscaling policy, admission rules, quota behavior, and validated overload response.

## Stop conditions
Stop if capacity per replica is unmeasured, priority policy is undefined, or infrastructure cannot provide required capacity.