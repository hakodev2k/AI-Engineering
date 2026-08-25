# Partitioning and Ordering

## Purpose
Design partitioning and ordering rules that scale throughput without violating business sequence requirements.

## When to use
Use when choosing partition keys, consumer concurrency, shard counts, or diagnosing hot partitions and out-of-order processing.

## Inputs
- Ordering scope
- Key cardinality and distribution
- Peak throughput
- Consumer parallelism
- Broker partitioning model

## Context to inspect
Inspect current key distributions, partition skew, rebalance behavior, consumer concurrency, and whether downstream systems require stronger ordering than the broker guarantees.

## Core knowledge
Ordering is usually guaranteed only within a partition or queue. Partition count affects concurrency, storage, metadata load, rebalance cost, and future scaling flexibility.

## Procedure
1. Define the smallest business scope that truly requires ordering.
2. Choose a stable key representing that scope.
3. Measure key cardinality and skew using production-like data.
4. Size partition count for expected throughput and consumer parallelism with headroom.
5. Validate producer partitioner behavior.
6. Align consumer concurrency with partition ownership.
7. Define behavior when keys are missing or malformed.
8. Plan repartitioning or destination migration before saturation.

## Decision points
Prefer entity-level ordering over global ordering. Increase partitions when parallelism is constrained, but account for reordering risks during migration and higher broker overhead.

## Common failure patterns
- Random keys where ordering matters
- A single global partition for convenience
- Low-cardinality keys creating hotspots
- Assuming increasing partitions preserves historical key mapping
- Consumer concurrency larger than useful partition count

## Verification
Load test key distributions, inspect per-partition throughput and lag, and verify ordered business scenarios during retries and consumer restarts.

## Expected output
A partition strategy with key semantics, partition sizing, scaling triggers, and ordering guarantees.

## Stop conditions
Stop when global ordering is requested without quantified business need, key distribution is unknown, or repartitioning would break downstream assumptions.