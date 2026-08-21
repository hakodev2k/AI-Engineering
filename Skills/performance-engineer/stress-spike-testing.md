# Stress and Spike Testing

## Purpose
Discover failure thresholds and evaluate how systems degrade and recover when traffic exceeds expected capacity or changes abruptly.

## When to use
Use for critical services, uncertain capacity, flash-traffic risk, autoscaling validation, and resilience work. Do not run uncontrolled stress tests against shared production dependencies.

## Inputs
Workload model, known capacity, architecture, autoscaling configuration, dependency quotas, observability, and explicit safety limits.

## Context to inspect
Inspect queue limits, circuit breakers, rate limits, thread/connection pools, autoscaling lag, memory limits, database saturation, and recovery behavior.

## Core knowledge
Stress testing asks where the system breaks; spike testing asks how it reacts to sudden change. Useful results include the knee point, failure mode, blast radius, and recovery characteristics, not merely maximum requests per second.

## Procedure
1. Define failure and safety thresholds.
2. Establish a healthy baseline.
3. Increase load in controlled stages until SLO degradation or saturation appears.
4. Identify the first constrained resource and the system knee point.
5. Continue only within approved safety bounds to characterize failure.
6. For spike scenarios, apply abrupt but bounded traffic changes.
7. Observe shedding, queueing, retries, autoscaling, and dependency impact.
8. Reduce load and measure recovery time and backlog drainage.
9. Check for leaked resources or persistent degradation.
10. Document safe capacity, failure mode, and remediation priorities.

## Decision points
Stop before destructive failure when the goal is capacity discovery. Push further only in isolated environments when recovery behavior itself must be tested.

## Common failure patterns
Confusing client failure with server failure, retry storms, unlimited queues, testing without recovery observation, and reporting a peak number without the latency/error conditions attached.

## Verification
Reproduce the identified knee point and confirm recovery returns to baseline without residual resource exhaustion.

## Expected output
A capacity/failure envelope with bottlenecks, degradation behavior, and recovery evidence.

## Stop conditions
Abort immediately if safety limits, dependency protections, or environment isolation assumptions are violated.