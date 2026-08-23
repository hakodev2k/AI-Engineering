# Sharding and Partitioning Rules

## Purpose
Distribute data and workload without creating hidden hotspots or unsafe ownership ambiguity.

## Scope
Database sharding, stream partitioning, tenant routing, and key-based workload distribution.

## MUST
- Partition keys MUST be chosen using measured cardinality, access patterns, and hotspot risk.
- Ownership and routing changes MUST preserve correctness during movement.
- Rebalancing MUST define capacity, failure, and rollback behavior.

## MUST NOT
- MUST NOT select partition keys solely for implementation convenience.
- MUST NOT move ownership without handling in-flight reads and writes.

## SHOULD
- Prefer partition schemes that permit incremental scaling and targeted recovery.

## Exceptions
Static partitioning requires documented growth bounds.

## Verification
Review key distribution, hotspot metrics, rebalance tests, routing correctness, and failure recovery.