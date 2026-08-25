# Messaging Capacity Planning

## Purpose
Forecast broker, storage, network, partition, and consumer capacity so the platform absorbs growth and failures without breaching SLOs.

## When to use
Use for quarterly planning, onboarding large workloads, changing replication, or before peak events.

## Inputs
- Historical and forecast traffic
- Message sizes
- Retention
- Replication factor
- Consumer throughput
- Failure headroom target

## Context to inspect
Inspect per-destination throughput, storage growth, network utilization, CPU, disk latency, partition/queue counts, broker limits, and seasonal peaks.

## Core knowledge
Capacity must account for replication, retention, compaction, rebalancing, catch-up traffic, failure states, and operational maintenance—not only steady-state averages.

## Procedure
1. Establish current peak and p95/p99 traffic by workload.
2. Forecast message count and bytes separately.
3. Calculate storage from ingress, retention, replication, and compaction assumptions.
4. Model network for producer, replication, and consumer traffic.
5. Model node-loss and zone-loss operation with required headroom.
6. Check broker metadata and partition/queue limits.
7. Include consumer catch-up and replay scenarios.
8. Define scaling thresholds and procurement/provisioning lead time.
9. Reconcile forecast against measured load tests.

## Decision points
Scale out when fault isolation and parallelism are limiting; scale up when per-node performance is the bottleneck and operational simplicity matters more.

## Common failure patterns
- Planning from averages
- Ignoring replication traffic
- No failure-state headroom
- Retention growth without storage alarms
- Consumer replay omitted from network models

## Verification
Compare calculated limits with load tests, simulate node loss at projected peak, and confirm storage and network remain within safety margins.

## Expected output
A capacity model with assumptions, thresholds, headroom, growth forecast, and scaling actions.

## Stop conditions
Stop when workload forecasts are unavailable, broker service limits are unknown, or projected demand exceeds feasible architecture without redesign.