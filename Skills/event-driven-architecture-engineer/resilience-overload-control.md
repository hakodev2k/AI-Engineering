# Resilience and Overload Control

## Purpose
Keep event-driven systems stable during traffic spikes, dependency failures, and recovery surges.

## When to use
Use for capacity planning, consumer design, cascading-failure prevention, and incident remediation.

## Inputs
Traffic profiles, service capacities, broker retention, SLOs, dependency limits, recovery objectives.

## Context to inspect
Consumer concurrency, prefetch/batch settings, autoscaling, rate limits, retry policies, queue depth, and downstream saturation signals.

## Core knowledge
Queues absorb bursts but do not create capacity. Backlogs increase event age and recovery work. Unbounded concurrency transfers overload downstream. Backpressure, admission control, bounded retries, and capacity-aware scaling are complementary.

## Procedure
1. Determine sustainable processing rate for each stage.
2. Model peak ingress and maximum tolerable backlog age.
3. Bound consumer concurrency and in-flight work.
4. Apply rate limits to protect downstream systems.
5. Coordinate retries with overload signals.
6. Scale on useful signals such as lag plus processing saturation.
7. Define degradation or shedding for low-value workloads.
8. Reserve capacity for recovery where required.
9. Load-test spike, outage, and catch-up scenarios.

## Decision points
Scale out when partitions and downstream capacity permit; throttle when dependencies are saturated; shed or defer low-priority events when SLO protection requires it.

## Common failure patterns
Autoscaling solely on CPU, unlimited prefetch, retry storms, scaling consumers beyond database capacity, and ignoring backlog recovery time.

## Verification
Stress tests remain stable, backlog drains within objective, downstream saturation stays bounded, and no uncontrolled retry amplification occurs.

## Expected output
Capacity limits, scaling/backpressure policy, degradation rules, and tested recovery behavior.

## Stop conditions
Stop when downstream capacity or business priority rules are unknown.