# Idempotency and Side-Effect Rules

## Purpose
Prevent duplicate external effects when agent steps are retried, resumed, replayed, or executed concurrently.

## Scope
Applies to payments, messages, tickets, deployments, database writes, file changes, workflow triggers, and other state-changing actions.

## MUST
- Every retryable state-changing action MUST define whether it is idempotent.
- Non-idempotent actions MUST use deduplication, idempotency keys, transactional guards, or an equivalent control before automatic retry.
- The system MUST persist enough execution state to distinguish not-started, in-progress, committed, failed, and uncertain outcomes.
- Recovery logic MUST treat unknown commit state as a distinct condition requiring reconciliation.
- Duplicate suppression MUST be scoped to the correct tenant, operation, and business identity.

## MUST NOT
- A timed-out action MUST NOT be assumed to have failed before its external commit state is established.
- Agents MUST NOT repeat destructive actions solely because the previous response was missing.
- Retries MUST NOT create duplicate user-visible side effects.

## SHOULD
- Side-effecting tools SHOULD expose stable operation identifiers.
- Workflows SHOULD prefer compensatable or reversible operations when equivalent options exist.

## Exceptions
Exceptions require explicit evidence that duplication is harmless or externally prevented, plus documented recovery behavior.

## Verification
Run duplicate-delivery tests, timeout-after-commit tests, concurrent execution tests, replay tests, and inspect audit records for exactly-once business outcomes where required.