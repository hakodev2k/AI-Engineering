# Autoscaling Rules

## Purpose
Scale model-serving capacity using signals that reflect real resource pressure and startup delay.

## Scope
Applies to replica, node, and accelerator autoscaling.

## MUST
- Choose scaling signals that correlate with saturation, such as queue depth, concurrency, token load, or accelerator pressure.
- Account for model load and warmup time in scaling policy design.
- Define minimum capacity for required availability and recovery objectives.
- Test scale-up and scale-down behavior under burst and sustained workloads.

## MUST NOT
- Scale solely from CPU when accelerator or queue pressure is the actual bottleneck.
- Scale down replicas that still own in-flight work without safe draining.
- Treat autoscaling as a substitute for admission control.

## SHOULD
- Use hysteresis or stabilization windows to avoid oscillation.
- Preserve headroom for replica loss and demand spikes.

## Exceptions
Aggressive scaling policies require workload evidence, guardrails, rollback configuration, and production approval.

## Verification
Review autoscaler configuration, scaling-event timelines, queue and utilization metrics, burst tests, and drain behavior.