# Capacity and Scaling Rules

## Purpose
Maintain sufficient headroom for predictable growth, failover, maintenance, and burst demand.

## Scope
CPU, memory, storage, IOPS, connections, throughput, shard or replica capacity, and growth forecasts.

## MUST
- Define capacity thresholds and minimum failover headroom for critical databases.
- Forecast storage and workload growth from measured trends.
- Test scaling actions before saturation becomes an incident.
- Include maintenance, rebuild, backup, and failover load in capacity models.

## MUST NOT
- Do not plan capacity from average utilization alone.
- Do not scale a bottleneck without verifying the actual limiting resource.

## SHOULD
- Maintain automated forecasts and alerts for time-to-exhaustion.

## Exceptions
Temporary reduced headroom requires risk acceptance, owner, expiry, and contingency plan.

## Verification
Review utilization distributions, forecasts, saturation events, scaling tests, and failover capacity evidence.