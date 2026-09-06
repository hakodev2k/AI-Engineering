# Scalability and Partitioning Rules

## Purpose
Scale CDC throughput while preserving required ordering, recovery, and source safety.

## Scope
Partitions, shards, connector parallelism, key distribution, hotspots, and capacity.

## MUST
- Partition strategy MUST reflect ordering requirements and source topology.
- Capacity plans MUST include peak change rate, burst size, large transactions, and recovery backlog.
- Hot-key and skew behavior MUST be measured.
- Parallelism changes MUST be validated for ordering and checkpoint semantics.
- Critical pipelines MUST retain headroom for catch-up after expected outages.

## MUST NOT
- MUST NOT add partitions blindly when doing so changes key ordering.
- MUST NOT size only for average write rate.
- MUST NOT increase connector parallelism beyond source-safe limits without measurement.

## SHOULD
- Load-test bursty and skewed workloads.
- Track throughput per source shard and downstream partition.

## Exceptions
Temporary operation below required headroom requires owner, expiry, and risk acceptance.

## Verification
Inspect capacity models, partition keys, load tests, skew metrics, backlog-drain rates, and source impact.