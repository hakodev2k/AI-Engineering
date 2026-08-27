# Cache Invalidation

## Purpose
Design and operate deterministic invalidation so cached state converges after authoritative changes.

## When to use
Use for mutable cached data, stale-read incidents, schema migrations, or write-path changes.

## Inputs
Write flows, cache topology, entity relationships, event guarantees, freshness objectives.

## Context to inspect
Inspect all writers, transaction boundaries, events, key derivation, replication lag, retries, and existing purge APIs.

## Core knowledge
Invalidation is a distributed consistency problem. Deletes may race with fills; events may duplicate or reorder; a write and invalidation are rarely atomic across systems. Versioned keys, write-through patterns, transactional outbox, and idempotent consumers reduce ambiguity.

## Procedure
1. Map authoritative writes to affected cache keys.
2. Define the required convergence time.
3. Choose delete, update, version bump, tag purge, or event-driven invalidation.
4. Place invalidation relative to the source transaction deliberately.
5. Make invalidation idempotent.
6. Handle duplicate, delayed, and out-of-order events.
7. Prevent stale fill races with versions or compare-before-set logic when needed.
8. Add retry with bounds and dead-letter visibility.
9. Test concurrent read/write/invalidate sequences.
10. Monitor invalidation lag and failures.

## Decision points
Delete-on-write is simple but causes misses. Update-on-write can preserve hit rate but couples representations to writers. Versioned namespaces simplify broad invalidation at memory cost. Event-driven invalidation scales ownership but requires delivery semantics.

## Common failure patterns
Only one writer invalidates; delete-before-commit; lost events; recursive invalidation storms; wildcard scans in hot paths; stale fills after deletes.

## Verification
Run concurrency tests and fault injection; prove changed source data converges within the declared window.

## Expected output
An invalidation map, ordering contract, retry strategy, and observable convergence evidence.

## Stop conditions
Stop if all authoritative writers cannot be identified or the event/transaction guarantees are unknown.