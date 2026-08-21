# Skill: Design a Resumable Backfill

## Purpose
Turn a data migration/backfill into a bounded, resumable, idempotent plan that can survive process crashes without duplicating or skipping work.

## Use when
A task updates many existing records, rebuilds derived state, migrates data shape, or performs a long-running corrective write.

## Inputs
Business invariant, source/target stores, selection predicate, stable ordering key, transform implementation/version, expected volume, runtime constraints, verification queries, rollback/compensation strategy.

## Preconditions
- Read access to inspect source shape and counts.
- A stable ordering/cursor strategy can be defined.
- No production mutation has started.

## Procedure
1. Define `migration_id` and revision.
2. Write the exact source predicate and stable ordering key; reject offset-only pagination for a mutating dataset unless evidence proves it safe.
3. Fingerprint transformation logic or release artifact.
4. Choose idempotency strategy: upsert, compare-and-set, dedupe-key, or no-op-if-complete.
5. Choose chunk size below policy maximum and document transaction boundary.
6. Define checkpoint cursor semantics and monotonic `checkpoint_version`.
7. Define read-after-write verification for each chunk plus final aggregate invariants.
8. Define retryable errors separately from deterministic/business failures.
9. Define compensation/rollback if writes are reversible; otherwise mark irreversible and require human approval.
10. Generate `plan_fingerprint` with `scripts/fingerprint-backfill-plan.py`.
11. Create initial checkpoint bound to that fingerprint.
12. Request independent review for production/schema-coupled/destructive work.

## Expected output
Plan JSON + initial checkpoint + risk/approval classification.

## Verification
Run `validate-backfill-state.py`; confirm source predicate, transform hash, cursor, verification checks and idempotency are explicit.

## Failure handling
If no stable cursor or idempotent write can be defined, stop. Do not hide the gap with larger transactions or blind retries.

## Stop conditions
Stop before production execution until explicit human approval and deterministic resume gate both allow the action.
