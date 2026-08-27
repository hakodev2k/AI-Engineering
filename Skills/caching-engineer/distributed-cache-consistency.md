# Distributed Cache Consistency

## Purpose
Define and enforce consistency expectations across replicated cache nodes, application instances, and authoritative stores.

## When to use
Use for multi-node caches, replication, failover, stale-read incidents, or correctness-sensitive cached state.

## Inputs
Consistency requirement, replication topology, write paths, failover behavior, version information.

## Context to inspect
Inspect replication mode, lag, read routing, conflict behavior, invalidation, clocks, and source transactions.

## Core knowledge
Caches commonly provide weaker guarantees than databases. Replication lag, failover, concurrent fills, and reordered invalidations can expose old values. Version tokens and monotonic data versions are more dependable than wall-clock ordering.

## Procedure
1. State required read-after-write, monotonic-read, or eventual-consistency behavior.
2. Map where replicas can diverge.
3. Identify all ordering boundaries.
4. Add source-derived versions where stale overwrite is possible.
5. Define read routing after writes if read-your-writes is required.
6. Make invalidations idempotent and version-aware.
7. Define failover consistency behavior.
8. Test partitions, lag, failover, and reordered events.
9. Monitor replication/invalidation lag.

## Decision points
Accept eventual consistency for derived, low-risk data; bypass cache or route strongly when correctness demands stronger semantics. Do not claim guarantees the cache product does not provide.

## Common failure patterns
Using timestamps from unsynchronized clocks; stale replica promoted after failover; old fill overwriting new value; assuming delete is instantly global.

## Verification
Execute concurrency and failover tests against explicit consistency invariants.

## Expected output
A documented consistency model and verified mitigation for divergence scenarios.

## Stop conditions
Stop if business correctness requires guarantees unavailable from the selected cache topology.