# Autoscaling and Admission Control

## Purpose
Keep inference services stable through demand changes by scaling on meaningful saturation signals and rejecting excess work before collapse.

## When to use
Use for online serving, burst traffic, queue growth, overload incidents, or scaling-policy design.

## Inputs
Traffic patterns, startup time, capacity per replica, queue metrics, cache pressure, SLOs, quotas, and fleet limits.

## Context to inspect
Autoscaler, scheduler queues, model load/warm-up, health checks, rate limits, priority classes, and retry behavior.

## Core knowledge
GPU utilization alone is a weak scaling signal. Queue delay, active tokens, KV pressure, request class, and predicted demand better describe saturation. Admission control is necessary because autoscaling reacts after demand arrives and model startup can be slow.

## Procedure
1. Establish per-replica safe capacity from representative load tests.
2. Select leading saturation indicators and define target operating range below the latency cliff.
3. Account for model download/load/warm-up delay.
4. Configure minimum warm capacity for expected bursts.
5. Add bounded queues and per-tenant/class quotas.
6. Define explicit overload responses and retry guidance.
7. Prevent retries from multiplying overload.
8. Test scale-out, scale-in, draining, and node failure.
9. Monitor scaling lag, rejected work, queue age, and wasted idle capacity.

## Decision points
Use predictive or scheduled scaling for known spikes; reactive scaling for uncertain demand. Prefer rejection over unbounded queueing when latency has a hard usefulness limit.

## Common failure patterns
Scaling on average GPU utilization, cold replicas receiving traffic too early, oscillation, retry storms, and no tenant fairness.

## Verification
Run burst and sustained overload tests; confirm bounded latency, controlled rejection, and recovery without oscillation.

## Expected output
Scaling/admission policy with capacity evidence and overload behavior.

## Stop conditions
Escalate when fleet quotas or startup latency make the required SLO impossible.