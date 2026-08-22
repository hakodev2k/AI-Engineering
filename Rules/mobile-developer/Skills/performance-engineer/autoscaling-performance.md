# Autoscaling Performance

## Purpose
Tune autoscaling so capacity arrives before SLOs collapse while avoiding oscillation, waste, and scaling against downstream bottlenecks.

## When to use
Use for elastic services, variable traffic, recurring saturation, slow scale-out, or excessive scaling cost.

## Inputs
Traffic patterns, capacity curves, scaling metrics/policies, startup time, SLOs, dependency limits, and cost constraints.

## Context to inspect
Inspect CPU/memory, concurrency, queue age, request rate, custom saturation signals, cooldowns, minimum/maximum instances, startup/warmup, and shared dependencies.

## Core knowledge
Reactive autoscaling has delay. The best signal is often a leading measure of saturation rather than a lagging latency metric. Scaling application instances cannot fix a saturated database or quota.

## Procedure
1. Establish per-instance SLO-compliant capacity.
2. Measure provisioning and warmup delay.
3. Select scaling signals correlated with approaching saturation.
4. Set thresholds with sufficient headroom for scaling lag.
5. Configure safe minimum, maximum, cooldown, and step behavior.
6. Validate downstream capacity at maximum scale.
7. Run ramp and spike tests.
8. Observe oscillation, cold starts, and uneven load distribution.
9. Tune scale-in conservatively to avoid churn.
10. Measure cost and SLO outcomes over real traffic cycles.

## Decision points
Use predictive/scheduled scaling for known events; reactive scaling for uncertain demand; queue-based signals for workers; concurrency/request-rate signals when CPU is not representative.

## Common failure patterns
Scaling on average CPU only, maximum replicas beyond database capacity, slow cold starts, aggressive scale-in, synchronized instance startup, and no quota headroom.

## Verification
Traffic ramps and spikes remain within acceptable SLO/error bounds and scaling converges without persistent oscillation or downstream overload.

## Expected output
A validated autoscaling policy with capacity assumptions and guardrails.

## Stop conditions
Escalate when required maximum capacity exceeds quotas, budget, or downstream safe limits.