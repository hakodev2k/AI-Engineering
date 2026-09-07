# Partitioning and Sharding Rules

## Purpose
Prevent hotspots, unbounded fan-out, and unsafe repartitioning.

## Scope
Horizontal partitioning, sharding, routing, resharding, and shard placement.

## MUST
- Partition strategy MUST define key distribution, expected growth, hotspot behavior, and routing semantics.
- Shard boundaries MUST support capacity growth without requiring an irreversible global rewrite.
- Resharding plans MUST define dual-read/write or equivalent transition behavior, verification, and rollback.
- Hot partitions MUST be detectable through metrics.

## MUST NOT
- MUST NOT choose monotonically increasing or low-cardinality keys when they create unacceptable hotspots.
- MUST NOT reshard production data destructively without tested recovery and approval.
- MUST NOT assume uniform traffic merely because record counts are uniform.

## SHOULD
- Partition design SHOULD preserve locality for dominant queries.
- Virtual shards or indirection SHOULD be considered where they materially reduce future migration cost.

## Exceptions
Nonstandard strategies require workload evidence, capacity analysis, failure scenarios, and explicit approval for irreversible changes.

## Verification
Inspect distribution metrics, routing tests, load tests, reshard rehearsals, and recovery evidence.