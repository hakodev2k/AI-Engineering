# Offline and Synchronization Rules

## Purpose
Prevent data loss, duplicate effects, and inconsistent user state under intermittent connectivity.

## Scope
Applies to offline-first behavior, queues, synchronization, conflict resolution, and cached mutations.

## MUST
- Define the source of truth and conflict policy for every synchronizable entity.
- Persist user mutations that must survive process death before reporting them as safely queued.
- Make replayable mutations idempotent or attach stable operation identity enabling deduplication.
- Represent sync status and terminal failures explicitly when they affect user expectations.
- Test reconnect, duplicate delivery, reordering, partial failure, and stale-client scenarios.

## MUST NOT
- Equate local write success with remote commit when the distinction matters.
- Silently discard unsynchronized user changes.
- Resolve conflicts with last-write-wins unless its data-loss semantics are acceptable and documented.

## SHOULD
- Prefer incremental, resumable synchronization.
- Bound retained queues and define recovery for poison operations.

## Exceptions
Disposable telemetry or regenerable cache data may use weaker durability when loss is explicitly acceptable.

## Verification
Use deterministic sync simulations, integration tests, database inspection, server idempotency evidence, and tests across process termination and connectivity changes.