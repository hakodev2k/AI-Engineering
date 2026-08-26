# Capacity Planning

## Purpose
Forecast MySQL compute, memory, storage, I/O, connection, and replication capacity before saturation causes incidents.

## When to use
Use for growth planning, launches, topology changes, budget cycles, or recurring saturation.

## Inputs
Historical growth, peak workload, data/index size, IOPS/latency, CPU, memory, connections, replication throughput, business forecasts.

## Context to inspect
Seasonality, retention, schema growth, headroom policy, backup/restore rates, failover capacity, maintenance operations.

## Core knowledge
Capacity must cover steady state, bursts, failure mode, catch-up, and maintenance. Average utilization hides tail risk. Database growth changes index depth, cache fit, backup time, and DDL duration.

## Procedure
1. Establish current peak and percentile baselines.
2. Separate data growth from request/write growth.
3. Identify the first likely bottleneck.
4. Model expected, high, and failure-mode scenarios.
5. Reserve headroom for replica loss and maintenance.
6. Project storage including indexes, logs, temp space, and online DDL.
7. Validate with load tests where uncertainty is material.
8. Define scaling triggers and lead times.
9. Revisit forecasts after major product/workload changes.

## Decision points
Scale vertically when simpler and within limits; scale reads with replicas when consistency allows; partition/shard only when simpler scaling cannot meet trajectory.

## Common failure patterns
Planning from averages, ignoring failover headroom, forgetting index/binlog growth, assuming linear query cost, and scaling only after alerts fire.

## Verification
Compare forecast against subsequent actuals, load-test critical thresholds, and prove a single failure still leaves acceptable capacity.

## Expected output
Capacity model, bottleneck forecast, scaling triggers, and uncertainty/risk notes.

## Stop conditions
Escalate when business growth assumptions are unavailable or projected demand requires architectural change beyond current system limits.