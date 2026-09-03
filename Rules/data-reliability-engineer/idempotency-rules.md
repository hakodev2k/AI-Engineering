# Idempotency Rules

## Purpose
Ensure retries and reprocessing do not corrupt or duplicate production data.

## Scope
Ingestion, transformations, loads, writes, merges, side effects, and orchestration retries.

## MUST
- Design retryable processing so repeated execution produces the intended final state.
- Define stable deduplication or idempotency keys where duplicate delivery is possible.
- Test representative retry, timeout, and partial-failure scenarios.
- Separate retriable processing from irreversible external side effects.

## MUST NOT
- Assume exactly-once delivery without evidence from the complete end-to-end path.
- Use blind append semantics when retries can create duplicate business records.
- Retry non-idempotent destructive operations automatically without safeguards.

## SHOULD
- Prefer deterministic upsert, merge, or transactional patterns where appropriate.
- Persist processing checkpoints when replay cost or ambiguity is significant.

## Exceptions
Non-idempotent behavior requires documented reason, duplicate-detection controls, bounded risk, and approval.

## Verification
Run duplicate-delivery tests, retry simulations, reconciliation queries, and inspect write semantics plus checkpoint state.