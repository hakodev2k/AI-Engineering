# Offline-First and Data Synchronization

## Purpose
Design mobile data flows that remain usable across intermittent connectivity and reconcile local/remote changes predictably.

## When to use
Use when users create or edit data offline, synchronization is asynchronous, or network loss must not block core workflows.

## Inputs
Consistency expectations, conflict rules, server capabilities, identifiers, mutation semantics, retention limits.

## Context to inspect
Local store, API idempotency, timestamps/version vectors, queues, auth lifecycle, background execution, telemetry.

## Core knowledge
Offline-first systems require explicit source-of-truth and conflict semantics. Delivery may be at-least-once, so mutations need stable IDs/idempotency and durable progress tracking.

## Procedure
1. Define user-visible consistency guarantees.
2. Assign stable entity and mutation identities.
3. Persist local mutations before reporting durable success.
4. Track sync state separately from domain state.
5. Order/de-duplicate operations where required.
6. Define conflict detection and resolution per entity/field.
7. Bound retry/backoff and handle auth expiration.
8. Reconcile server canonical state without losing local intent.
9. Surface actionable unresolved conflicts.
10. Test long-offline and multi-device scenarios.

## Decision points
Use server-wins/client-wins only when domain semantics permit; otherwise merge or require user resolution. Sync eagerly for freshness, opportunistically for battery efficiency.

## Common failure patterns
Timestamp-only conflict resolution, duplicate mutations, infinite retry, silent data loss, queue growth, and assuming background execution is guaranteed.

## Verification
Simulate offline edits, duplicate delivery, reordering, conflicts, app termination, auth expiry, and reconnection.

## Expected output
Documented consistency/conflict policy and a durable, observable synchronization pipeline.

## Stop conditions
Stop when server APIs cannot support required identity/consistency guarantees or conflict policy is undefined.