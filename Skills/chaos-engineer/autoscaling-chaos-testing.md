# Autoscaling Chaos Testing

## Purpose
Validate that scaling policies respond safely to demand and failures without oscillation, delayed recovery, or runaway cost.

## When to use
Use for horizontally or vertically scaled services and event-driven workers.

## Inputs
Scaling rules, quotas, startup times, workload profiles, resource limits, and SLOs.

## Context to inspect
Inspect scaling metrics, cooldowns, minimum/maximum capacity, queue lag, dependency capacity, quotas, and cold-start behavior.

## Core knowledge
Autoscaling is a feedback system. Lagging metrics, slow startup, downstream bottlenecks, and correlated failures can make scaling ineffective or destabilizing.

## Procedure
1. Define expected scaling response and capacity ceiling.
2. Establish baseline demand and resource use.
3. Introduce bounded load or remove capacity.
4. Measure detection, provisioning, warm-up, and stabilization times.
5. Observe downstream saturation and cost growth.
6. Test scale-down after recovery.
7. Tune signals, limits, and cooldowns.

## Decision points
Scale on demand indicators when resource metrics lag; retain resource signals when they directly predict saturation. Keep minimum capacity where startup latency threatens SLOs.

## Common failure patterns
Scaling on CPU despite queue bottlenecks, no quota headroom, scale-out overwhelming databases, oscillation, and premature scale-down.

## Verification
Confirm scaling maintains SLOs within defined limits and returns to stable capacity after the experiment.

## Expected output
Measured scaling behavior, bottlenecks, and safe policy recommendations.

## Stop conditions
Stop for uncontrolled cost, quota exhaustion threatening unrelated workloads, or cascading dependency saturation.