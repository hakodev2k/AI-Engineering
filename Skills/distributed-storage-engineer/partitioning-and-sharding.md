# Partitioning and Sharding

## Purpose
Design partitioning schemes that distribute data and load while preserving predictable routing, scalability, and operational safety.

## When to use
Use when a dataset or workload no longer fits a single node, when hot spots emerge, or when planning horizontal scale. Do not shard prematurely when vertical scaling or a simpler managed topology is sufficient.

## Inputs
Key distribution, query patterns, write patterns, data size, growth rate, tenant model, locality requirements, skew measurements, and rebalance constraints.

## Preconditions
Know the dominant access paths and whether cross-partition operations are allowed or expensive.

## Context to inspect
Current key design, routing logic, partition map, indexes, replication layout, transaction boundaries, batch jobs, analytics queries, and operational tooling.

## Core knowledge
Range partitioning preserves locality but can create hot ranges. Hash partitioning balances random keys but weakens locality. Consistent hashing reduces movement during membership changes but still needs skew control. Partition keys are long-lived architectural commitments because they shape queries, transactions, and rebalancing.

## Procedure
1. Quantify present and projected data volume and request rate.
2. Identify natural partition keys and access locality.
3. Measure key cardinality and skew.
4. Compare range, hash, directory-based, and hybrid schemes.
5. Define partition size and split/merge thresholds.
6. Define routing and ownership metadata.
7. Design replication placement independently from logical partitioning.
8. Define cross-partition query and transaction behavior.
9. Design online split, merge, and movement workflows.
10. Protect against hot keys and noisy tenants.
11. Add metrics for partition size, throughput, latency, and movement.
12. Test routing correctness during topology changes.

## Decision points
Choose range partitioning for locality-sensitive scans, hash partitioning for balanced point access, and directory-based mapping when placement flexibility is more important than routing simplicity.

## Common failure patterns
Low-cardinality shard keys, monotonic hot keys, cross-shard joins everywhere, hidden global indexes, oversized partitions, routing cache staleness, and rebalancing without bandwidth controls.

## Verification
Run skew analysis, load tests, split/merge tests, routing consistency checks, and rebalance exercises. Confirm that no expected workload produces unacceptable hot partitions.

## Expected output
A partitioning strategy with key choice, routing model, split/merge policy, hot-key mitigation, and operational limits.

## Stop conditions
Stop when access patterns are unknown, partition-key semantics conflict with required transactions, or migration cannot be performed safely online.