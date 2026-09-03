# Memory Storage Architecture

## Purpose
Select and structure storage technologies for transactional memory, semantic retrieval, temporal history, and derived indexes while preserving correctness and operability.

## When to use
Use when designing a new memory platform, scaling an existing one, or separating overloaded storage responsibilities.

## Inputs
Memory taxonomy, access patterns, scale, latency SLOs, consistency requirements, retention rules, cost constraints.

## Preconditions
Have representative read/write workloads and identity boundaries.

## Context to inspect
Existing relational/document stores, vector databases, caches, object storage, replication, backups, and operational tooling.

## Core knowledge
No single database is optimal for every memory access pattern. The primary store should preserve authoritative state; vector and search indexes are usually derived views that must tolerate rebuilds.

## Procedure
1. Classify access patterns by memory type.
2. Define authoritative record ownership.
3. Select storage based on transactions, indexing, and scale.
4. Separate primary data from rebuildable derived indexes.
5. Define consistency between stores.
6. Design partition and tenant keys.
7. Define backup and restore behavior.
8. Estimate capacity and cost growth.
9. Test failure and rebuild scenarios.
10. Document operational ownership and SLOs.

## Decision points
Prefer a transactional primary store when mutations and provenance matter. Introduce specialized vector or graph stores only when measured retrieval needs justify them.

## Common failure patterns
Treating vector indexes as source of truth; cross-store dual writes without recovery; poor tenant partitioning; unbounded record growth.

## Verification
Load-test representative operations and prove authoritative state can rebuild derived indexes after loss.

## Expected output
A storage architecture with consistency, partitioning, recovery, and cost rationale.

## Stop conditions
Stop when consistency or durability requirements are unspecified.