# Distributed Database Capacity Planning

## Purpose
Forecast and provision compute, memory, storage, network, and replication capacity before growth threatens reliability.

## When to use
Use for quarterly planning, launches, region expansion, shard growth, or saturation investigations.

## Inputs
Historical utilization, growth forecast, workload mix, replication factor, SLOs, maintenance overhead, failure requirements.

## Context to inspect
Per-node and per-shard CPU, memory, disk IOPS, space, network, compaction, cache hit rate, query concurrency, and rebuild rates.

## Core knowledge
Capacity must include failure and maintenance states, not only steady-state averages. Distributed databases need headroom for replica rebuilds, rebalancing, compaction, backups, and skew. Tail latency often degrades before average utilization reaches 100%.

## Procedure
1. Establish workload and dataset growth trends.
2. Identify the first saturating resource per workload class.
3. Model peak rather than average demand.
4. Include replication and write amplification.
5. Reserve headroom for one expected failure domain.
6. Model maintenance and rebuild load.
7. Quantify skew and largest-partition constraints.
8. Define scale triggers with lead time.
9. Validate assumptions through load tests.

## Decision points
Scale up when per-node efficiency and operational simplicity dominate; scale out when storage, throughput, isolation, or failure-domain requirements demand distribution.

## Common failure patterns
Linear extrapolation across architecture limits, ignoring disk space for compaction, no failure headroom, using cluster averages, and scaling after saturation alerts fire.

## Verification
Compare model predictions with controlled load tests and previous growth periods; confirm the cluster meets SLOs during simulated node loss.

## Expected output
A capacity model, headroom policy, scale thresholds, procurement/deployment lead times, and validation evidence.

## Stop conditions
Escalate when forecasts lack workload assumptions or planned capacity cannot survive required failure scenarios.