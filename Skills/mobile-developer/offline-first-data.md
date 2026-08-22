# Offline-First Data

## Purpose
Design mobile data flows that remain useful during disconnection and converge safely afterward.

## When to use
Field apps, unreliable networks, cached content, queued writes, sync-heavy products.

## Inputs
Data model, freshness rules, mutation semantics, conflict policy.

## Context to inspect
Local database, API, identifiers, timestamps/versions, sync triggers, deletion semantics.

## Core knowledge
Offline-first requires an explicit source of truth, synchronization protocol, conflict policy, retry safety, and user-visible freshness semantics.

## Procedure
1. Classify reads/writes by offline requirement.
2. Choose local authoritative representation.
3. Define stable IDs and version metadata.
4. Define queued mutation lifecycle.
5. Define conflict detection and resolution.
6. Handle deletes/tombstones.
7. Make sync resumable and idempotent.
8. Expose pending/stale/conflicted state when relevant.
9. Test interrupted and reordered synchronization.

## Decision points
Use last-write-wins only when business loss is acceptable; otherwise merge, reject, or request user resolution.

## Common failure patterns
Timestamp-only conflict logic, duplicate writes, silent overwrite, unbounded queues, assuming ordered delivery.

## Verification
Airplane-mode scenarios, concurrent edits, crash during sync, duplicate delivery, clock-skew tests.

## Expected output
Documented local source of truth and deterministic synchronization behavior.

## Stop conditions
Escalate when business conflict semantics or data-loss tolerance are undefined.