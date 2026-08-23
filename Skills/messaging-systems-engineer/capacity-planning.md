# Messaging Capacity Planning

## Purpose
Estimate broker and consumer capacity with explicit headroom for growth, bursts and failures.

## When to use
Use before launch, scaling, partition changes or infrastructure commitments.

## Inputs
Message rate/size, retention, replication, processing cost, burst profile, SLO and growth forecast.

## Context to inspect
Current utilization, partitioning, storage, network, broker limits and recovery throughput.

## Core knowledge
Capacity must account for peak ingress, egress fan-out, replication, retention storage and catch-up after outages—not averages alone.

## Procedure
1. Measure representative rates and sizes.
2. Model peak and sustained throughput.
3. Include replication and consumer fan-out.
4. Estimate retention storage.
5. Calculate consumer service capacity.
6. Reserve failure and growth headroom.
7. Validate with load tests.
8. Define scaling thresholds.

## Decision points
Scale partitions/nodes before hard saturation; avoid excessive partition counts that increase operational overhead.

## Common failure patterns
Planning from daily averages, ignoring replay/catch-up and assuming linear scaling.

## Verification
Benchmark peak plus failure scenarios and compare measured capacity with model.

## Expected output
A capacity model with headroom and scaling triggers.

## Stop conditions
Stop if representative workload or provider limits are unavailable.