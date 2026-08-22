# Capacity Planning and Resource Management

## Purpose
Forecast database resource needs and prevent predictable saturation while controlling cost.

## When to use
Use for growth planning, seasonal events, platform sizing, consolidation, cloud cost reviews, and repeated saturation incidents.

## Inputs
Historical workload, growth trends, CPU, memory, IO, storage, connections, query mix, retention, business forecasts, and service limits.

## Context to inspect
Inspect peak versus average demand, headroom, storage growth, maintenance windows, replica capacity, quotas, scaling lead time, and workload seasonality.

## Core knowledge
Capacity is multi-dimensional. CPU headroom does not compensate for exhausted IOPS, memory pressure, connection limits, storage throughput, or maintenance constraints.

## Procedure
1. Establish current peak workload and resource baseline.
2. Identify the resource that limits throughput first.
3. Separate organic growth from inefficient workload growth.
4. Forecast data and traffic using multiple scenarios.
5. Include maintenance, failover, and degraded-mode headroom.
6. Evaluate scale-up, scale-out, workload optimization, archival, and tier changes.
7. Account for platform quotas and provisioning lead time.
8. Load test important forecast scenarios.
9. Define early-warning thresholds and review cadence.
10. Compare capacity options by cost and operational complexity.

## Decision points
Optimize obvious waste before buying capacity, but do not require risky optimization when inexpensive headroom is the safer business choice.

## Common failure patterns
Planning from averages, ignoring failover capacity, extrapolating linearly through architectural limits, and treating storage size as the only growth dimension.

## Verification
Validate forecasts against load tests and periodically compare predicted versus observed demand.

## Expected output
A capacity forecast with bottlenecks, headroom targets, scaling triggers, and costed options.

## Stop conditions
Stop when business growth assumptions are unavailable or the architecture has unknown hard limits requiring dedicated testing.