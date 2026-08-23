# Ordering and Partitioning

## Purpose
Preserve only the ordering guarantees the business requires while retaining scalable parallelism.

## When to use
Use when sequence matters or workloads require partitioned consumption.

## Inputs
Ordering key, throughput, consumer count, skew, state ownership and broker partition model.

## Context to inspect
Producer routing, partition count, rebalance behavior, hot keys and consumer concurrency.

## Core knowledge
Global ordering restricts concurrency. Per-key ordering is usually cheaper and more scalable. Partition count affects parallelism and operational evolution.

## Procedure
1. Identify the smallest ordering scope required.
2. Select stable partition key.
3. Measure key distribution and hotspots.
4. Size partitions for throughput and growth.
5. Align consumer concurrency with ordering rules.
6. Define behavior during retry and rebalance.
7. Test skew and out-of-order scenarios.

## Decision points
Avoid global ordering unless correctness truly requires it; shard hot entities only if business semantics allow.

## Common failure patterns
Random keys for stateful streams, assuming retries preserve order, and increasing concurrency beyond partition semantics.

## Verification
Load-test representative key distributions and assert sequence invariants under failures/rebalances.

## Expected output
A partitioning strategy with explicit ordering scope.

## Stop conditions
Escalate when ordering requirements conflict with required throughput.