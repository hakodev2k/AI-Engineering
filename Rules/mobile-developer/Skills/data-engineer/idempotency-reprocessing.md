# Idempotency and Reprocessing

## Purpose
Make data pipelines safe to retry, replay, backfill, and recover without duplicating or corrupting business state.

## When to use
Use for any pipeline with retries, asynchronous delivery, backfills, partial failures, or mutable source data.

## Inputs
Logical processing interval, source identifiers, target write model, checkpoint behavior, uniqueness constraints, and correction rules.

## Context to inspect
Inspect duplicate sources, retry mechanisms, merge/upsert behavior, transaction boundaries, target keys, and how historical corrections are represented.

## Core knowledge
Idempotency means repeating the same logical operation produces the same durable state. It can be achieved through deterministic keys, replacement by partition, merge/upsert, deduplication, or transactional publication.

## Procedure
1. Define the logical unit of work and identity.
2. Determine where duplicates can enter.
3. Choose deterministic target keys or replacement boundaries.
4. Separate compute from final publication when useful.
5. Commit checkpoints only after durable target success.
6. Make side effects retry-safe.
7. Define how corrections supersede prior data.
8. Build controlled replay/backfill tooling.
9. Test interruption at each state transition.
10. Reconcile post-replay results against a clean computation.

## Decision points
Replace complete partitions when recomputation is cheap and boundaries are clean; use merge/upsert when changes are sparse. Append-only designs require explicit version or deduplication semantics.

## Common failure patterns
Auto-increment keys for replayed records, checkpoints advancing before sink commit, non-idempotent notifications, duplicate aggregates, and manual cleanup as the normal retry strategy.

## Verification
Run identical inputs repeatedly, kill jobs before and after writes, replay historical intervals, and verify stable row counts and business totals.

## Expected output
A pipeline whose retries and reprocessing have documented, tested, deterministic effects.

## Stop conditions
Escalate when the target cannot support safe replacement or deduplication and duplicate business effects are unacceptable.