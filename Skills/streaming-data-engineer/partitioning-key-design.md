# Partitioning and Key Design

## Purpose
Choose partition keys that preserve required ordering while distributing load and enabling scalable processing.

## When to use
Use when creating topics, diagnosing skew/hot partitions, or changing stream topology.

## Inputs
Event cardinality, entity relationships, throughput distribution, ordering requirements, consumer parallelism.

## Context to inspect
Current keys, partition counts, broker hashing, key nullability, consumer state locality, observed skew.

## Core knowledge
Partitioning defines ordering scope and parallelism. A key should align with the smallest business invariant requiring order while having enough cardinality and reasonably balanced frequency.

## Procedure
1. State the exact ordering invariant.
2. Identify candidate entity keys.
3. Measure key cardinality and frequency distribution.
4. Estimate partition throughput and consumer concurrency.
5. Evaluate hot-key risk.
6. Test candidate hashing with realistic data.
7. Account for stateful joins and co-partitioning.
8. Plan partition-count growth and migration.
9. Monitor skew after release.

## Decision points
Use entity keys for per-entity order; composite keys when invariants span dimensions; salting only when order can be relaxed or reconstructed.

## Common failure patterns
Global keys; random keys that destroy required order; partition count chosen only from current load; repartitioning without state implications.

## Verification
Load tests show acceptable partition balance, ordering tests preserve invariants, and consumers scale to target concurrency.

## Expected output
Partition-key rationale, capacity assumptions, and monitoring thresholds.

## Stop conditions
Escalate when required global ordering conflicts with throughput objectives or key distribution cannot be characterized.