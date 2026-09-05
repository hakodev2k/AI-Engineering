# Ordering and Partitioning Rules

## Purpose
Preserve only the ordering guarantees the business actually requires while avoiding unsafe assumptions about global order.

## Scope
Topics, queues, partitions, keys, sharding, consumer groups, and ordered processing.

## MUST
- Required ordering scope MUST be defined explicitly, such as per entity, partition, or stream.
- Partition keys MUST be stable for records whose relative order matters.
- Repartitioning changes MUST assess ordering, hotspot, and consumer-state impact.
- Consumers MUST handle cross-partition interleaving when global ordering is not guaranteed.

## MUST NOT
- MUST NOT claim global order from a partitioned platform unless the architecture actually enforces it.
- MUST NOT choose low-cardinality keys that create predictable hotspots without capacity evidence.

## SHOULD
- Keep ordering requirements as narrow as business correctness permits.

## Exceptions
Alternative partitioning requires measured capacity evidence and migration safeguards.

## Verification
Inspect key strategy, partition distribution, ordering tests, lag by partition, and migration plans.