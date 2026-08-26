# Idempotent Upserts and Deletes

## Purpose
Guarantee repeatable writes and correct deletion propagation under retries, duplicate events, and out-of-order delivery.

## When to use
Use in any production ingestion or synchronization pipeline.

## Inputs
Stable entity key, source revision/version, event semantics, database write API, and retention/deletion requirements.

## Context to inspect
Inspect ID generation, upsert implementation, concurrency controls, event ordering, tombstones, retries, and reconciliation.

## Core knowledge
At-least-once systems routinely duplicate work. Idempotency requires deterministic identity plus version-aware mutation semantics. Deletes need equal rigor because stale vectors can leak obsolete or unauthorized content.

## Procedure
1. Define deterministic vector IDs from stable source identity and chunk identity.
2. Carry source revision or monotonic version where available.
3. Make repeated upserts converge to one logical state.
4. Reject or ignore stale out-of-order mutations.
5. Define delete/tombstone semantics and retention.
6. Handle source objects that change chunk counts by removing orphan chunks.
7. Bound retries and classify retryable errors.
8. Reconcile expected IDs against stored IDs periodically.
9. Test concurrent updates and duplicate deliveries.

## Decision points
Use last-write-wins only when clocks/order are trustworthy and business semantics permit it. Prefer source revisions or compare-and-set when stale overwrites are unacceptable. Hard-delete for strict erasure requirements; tombstone when audit/recovery needs justify retention and policy allows it.

## Common failure patterns
Random IDs per retry; deletes by metadata scan with weak predicates; stale events overwriting new vectors; chunk shrink leaving orphans; retrying validation errors; assuming provider upsert means application-level idempotency.

## Verification
Replay identical events, reorder updates, duplicate deletes, change chunk counts, and reconcile final storage against source truth.

## Expected output
Documented mutation semantics and tests proving convergence under duplicates and reordering.

## Stop conditions
Stop when stable identity/version cannot be derived or deletion policy is legally/security-sensitive and unresolved.