# Ordering and Partitioning

## Purpose
Preserve required ordering without unnecessary serialization.

## Scope
Partition keys, consumer concurrency, ordering guarantees, and rebalancing.

## MUST
- Ordering requirements MUST be stated in business terms and mapped to a stable key.
- Partition-key distribution MUST be evaluated for skew and hot partitions.
- Consumers MUST preserve ordering where the contract requires it.

## MUST NOT
- MUST NOT promise global ordering when the topology provides only partition-local ordering.
- MUST NOT change partition keys without migration analysis.

## SHOULD
- Limit ordering scope to the smallest business entity that requires it.

## Exceptions
Require documented trade-off, load evidence, migration plan, and approval.

## Verification
Test concurrent publication, rebalances, skew, and per-key sequence invariants.