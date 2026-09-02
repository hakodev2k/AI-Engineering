# Capacity Planning

## Purpose
Forecast and manage distributed-storage capacity so the system retains enough space, I/O, network, and recovery headroom to meet SLOs during growth and failures.

## When to use
Use for quarterly planning, launch readiness, cluster expansion, cost reviews, or when utilization approaches operational thresholds.

## Inputs
Current logical and physical bytes, growth rate, replication or coding overhead, write/read rates, compaction amplification, repair traffic, workload seasonality, hardware limits, and procurement lead time.

## Preconditions
Use measured production utilization and distinguish logical data size from physical footprint.

## Context to inspect
Per-node utilization, failure domains, rebalance limits, compaction debt, backup footprint, hot/cold tiers, network throughput, device performance, and historical growth.

## Core knowledge
Safe storage capacity is lower than raw capacity because recovery and maintenance need reserve space and bandwidth. Full disks can trigger cascading failures by blocking compaction, repair, or replica creation. Capacity must be planned for the largest credible failure while normal workload continues.

## Procedure
1. Establish current logical and physical utilization.
2. Calculate replication, metadata, index, tombstone, and compaction overhead.
3. Forecast data and traffic growth with uncertainty bands.
4. Determine safe per-node and per-failure-domain utilization ceilings.
5. Reserve headroom for node/zone loss and data movement.
6. Model disk IOPS/throughput and network, not bytes alone.
7. Include compaction and repair amplification.
8. Evaluate skew and hot-partition effects.
9. Determine scale-out trigger dates using provisioning lead time.
10. Compare hardware, tiering, retention, and compression alternatives.
11. Define capacity alerts and automated admission/backpressure thresholds.
12. Reconcile forecasts with actual growth regularly.

## Decision points
Add capacity when recovery headroom or performance margin approaches limits, not only when disks are nearly full. Use tiering or retention changes when access patterns support them and complexity is justified.

## Common failure patterns
Planning on average utilization, ignoring replication and temporary compaction space, no zone-failure reserve, relying on emergency provisioning, and modeling storage bytes while network or IOPS saturate first.

## Verification
Backtest forecasts against historical growth, test node/zone-loss capacity assumptions, and confirm the cluster can rebalance while meeting foreground SLOs.

## Expected output
A capacity model with utilization ceilings, growth scenarios, headroom, expansion triggers, and cost/performance trade-offs.

## Stop conditions
Stop when growth, retention, or failure-domain assumptions are too uncertain to support a defensible plan.