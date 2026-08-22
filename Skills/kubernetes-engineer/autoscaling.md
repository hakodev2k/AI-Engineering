# Autoscaling

## Purpose
Scale pods and nodes from meaningful demand signals while preserving SLOs and controlling instability and cost.

## When to use
Variable load, capacity incidents, cost optimization, or HPA/node autoscaler tuning.

## Inputs
Traffic profile, resource metrics, business metrics, startup time, SLOs, requests, and node provisioning latency.

## Context to inspect
HPA/VPA, custom metrics, requests, replica bounds, node autoscaler, pending pods, and historical load.

## Core knowledge
Autoscaling is a feedback loop. Bad metrics, long delays, or incompatible resource settings cause oscillation or late scaling.

## Procedure
1. Identify a metric correlated with saturation or demand.
2. Measure startup and provisioning delays.
3. Set minimum capacity for expected failures and bursts.
4. Configure targets and safe replica bounds.
5. Tune stabilization and scale policies.
6. Ensure node scaling can satisfy pod constraints.
7. Load-test ramps, spikes, and cooldowns.
8. Observe cost and SLO outcomes.

## Decision points
Use resource metrics for resource-bound services; queue/business metrics when they better represent demand. VPA recommendations may complement HPA but avoid conflicting controls.

## Common failure patterns
Scaling on CPU with wrong requests, min replicas too low, impossible scheduling constraints, metric lag, and no burst headroom.

## Verification
Replay representative load and verify timely scaling, stable recovery, acceptable latency, and bounded cost.

## Expected output
Measured autoscaling policy and documented assumptions.

## Stop conditions
Stop when no reliable demand/saturation metric exists.