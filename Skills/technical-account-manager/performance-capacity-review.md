# Performance and Capacity Review

## Purpose
Evaluate whether a customer deployment has sufficient performance headroom and a credible scaling plan for expected workload growth.

## When to use
Use before launches, expansions, seasonal peaks, migrations, or after sustained latency and saturation concerns.

## Inputs
Traffic forecasts, latency targets, throughput, resource metrics, architecture, quotas, workload patterns, and historical incidents.

## Context to inspect
CPU, memory, storage, network, queueing, concurrency, database dependencies, rate limits, autoscaling, caching, regional constraints, and load-test evidence.

## Core knowledge
Capacity decisions require workload shape, not just averages. Senior TAMs distinguish saturation from inefficient application behavior and include external bottlenecks.

## Procedure
1. Define SLOs and peak workload scenarios.
2. Establish current utilization and performance baselines.
3. Identify constrained resources and service quotas.
4. Review scaling behavior and failure thresholds.
5. Examine downstream dependencies and rate limits.
6. Compare forecast demand against tested capacity.
7. Recommend tuning, scaling, architecture, or quota actions.
8. Define validation tests and safety margins.
9. Recheck after remediation or workload changes.

## Decision points
Scale up for immediate bounded relief; scale out when architecture supports parallelism and growth requires resilience. Tune first when waste, locking, or inefficient queries dominate.

## Common failure patterns
Planning from average load, assuming autoscaling is instantaneous, ignoring dependencies, and changing capacity without measuring bottlenecks.

## Verification
Use load tests, production telemetry, or controlled benchmarks to demonstrate target throughput and latency with agreed headroom.

## Expected output
A capacity assessment with bottlenecks, forecasts, actions, validation evidence, and residual risks.

## Stop conditions
Stop when forecasts are unavailable, tests would endanger production, or capacity depends on unapproved infrastructure or contractual changes.