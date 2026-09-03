# Partitioning Strategy

## Purpose
Partition event workloads for scalable throughput while preserving locality and required ordering.

## When to use
Use when choosing topic partitions, sharding keys, or resolving hotspots and skew.

## Inputs
Traffic distribution, entity cardinality, ordering scope, throughput, retention, consumer count.

## Context to inspect
Broker limits, key distribution, largest tenants/entities, consumer groups, historical growth, and re-partitioning constraints.

## Core knowledge
Partition keys determine parallelism, locality, ordering scope, and hotspot risk. High-cardinality stable keys generally distribute well; dominant tenants may require special treatment.

## Procedure
1. Quantify current and projected throughput.
2. Define required ordering/locality boundaries.
3. Profile candidate key distributions.
4. Estimate per-partition peak load, not just averages.
5. Select partition count with operational headroom.
6. Define handling for hot keys.
7. Verify consumer parallelism can exploit partitions.
8. Plan partition expansion and key migration effects.
9. Load-test realistic skew.

## Decision points
Partition by aggregate/entity when per-entity order matters; by tenant when tenant isolation/locality dominates; use composite hashing when skew is unacceptable and ordering can be relaxed.

## Common failure patterns
Low-cardinality keys, timestamp keys, partition count tied only to current traffic, ignoring largest tenants, and assuming repartitioning preserves prior key-to-partition mapping.

## Verification
Load tests show acceptable skew, latency, throughput, and consumer utilization at projected peak plus headroom.

## Expected output
A documented partition-key and capacity strategy with hotspot mitigations.

## Stop conditions
Stop if traffic distribution is unknown or ordering requirements prevent safe scaling without architectural change.