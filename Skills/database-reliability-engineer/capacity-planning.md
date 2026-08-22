# Capacity Planning

## Purpose
Forecast database resource demand and preserve reliability before workloads exhaust critical limits.

## When to use
Use for growth planning, launches, migrations, seasonal traffic, or recurring saturation.

## Inputs
CPU, memory, IOPS, storage, connections, throughput, growth trends, workload forecasts, and redundancy requirements.

## Context to inspect
Historical peaks, headroom, autoscaling limits, failover capacity, maintenance overhead, quotas, and cost constraints.

## Core knowledge
Capacity must cover normal peaks plus failure-mode operation. Average utilization hides burst, skew, queueing, and hot partitions.

## Procedure
1. Define workload units and business growth drivers.
2. Establish resource baselines and peak percentiles.
3. Identify hard limits and nonlinear saturation points.
4. Model growth under normal and failure scenarios.
5. Reserve failover and maintenance headroom.
6. Evaluate vertical scaling, horizontal scaling, partitioning, and workload reduction.
7. Set capacity thresholds and lead times.
8. Reforecast after major workload changes.

## Decision points
Scale vertically for simplicity when limits and economics permit; scale horizontally when growth, isolation, or availability requires it.

## Common failure patterns
Planning from averages, ignoring replica capacity, connection limits, storage growth, vacuum/compaction overhead, and provider quotas.

## Verification
Compare forecast against load tests and historical peaks; verify remaining capacity after a planned node failure.

## Expected output
A capacity forecast, risk thresholds, scaling triggers, and concrete remediation plan.

## Stop conditions
Escalate when demand uncertainty is material, scaling requires architecture change, or provider limits cannot satisfy forecast.