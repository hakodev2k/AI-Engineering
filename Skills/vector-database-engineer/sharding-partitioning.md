# Sharding and Partitioning

## Purpose
Partition vector data and traffic to scale safely while preserving recall, routing correctness, and operability.

## When to use
Use when a single-node envelope is insufficient, tenants require isolation, or locality materially improves performance.

## Inputs
Corpus distribution, tenant sizes, query routing keys, QPS, growth, replication, failure domains, and rebalance capabilities.

## Context to inspect
Inspect current shard sizes, hot keys, routing, cross-shard fan-out, replicas, rebalancing, index build behavior, and operational tooling.

## Core knowledge
Shard keys determine locality and hotspots. Random/hash partitioning balances load but may require query fan-out; semantic/range/tenant partitioning improves locality but risks skew. Fan-out increases tail latency and coordination cost.

## Procedure
1. Define why partitioning is needed and target shard envelope.
2. Analyze candidate keys for cardinality, skew, growth, and routing availability.
3. Estimate query fan-out and result merge behavior.
4. Plan replication and failure domains.
5. Test hot-tenant and uneven-growth scenarios.
6. Define split, move, and rebalance procedures.
7. Ensure filters/authorization remain correct after routing.
8. Benchmark recall and p99 across shard counts.
9. Monitor shard size, QPS, saturation, and imbalance.

## Decision points
Prefer hash partitioning for balance when queries can fan out; tenant partitioning when isolation/local routing dominates; dedicated partitions for exceptionally large tenants when justified. Avoid semantic partitioning unless routing reliably identifies relevant partitions.

## Common failure patterns
Low-cardinality shard keys; hot shards; assuming even tenant sizes; excessive fan-out; no rebalance plan; cross-shard top-k merge errors; shard count chosen only for current size.

## Verification
Load-test representative routing, fail a shard/replica, rebalance data, and verify merged results against an unsharded quality baseline.

## Expected output
A shard strategy, routing contract, capacity envelope, rebalance runbook, and quality/performance evidence.

## Stop conditions
Stop if routing semantics are ambiguous, rebalancing is unsafe, or partitioning would weaken security isolation.