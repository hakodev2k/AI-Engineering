# Saga Safety Rules

## MUST
- Identify every externally visible side effect before execution.
- Assign a stable operation/idempotency key to every retryable write.
- Define compensation for each compensable side effect and record why any step is non-compensable.
- Execute compensations in reverse committed order unless domain evidence proves another order.
- Persist enough state to distinguish not-started, in-flight, committed, and compensated steps.
- Preserve evidence for every failed execution or compensation attempt.
- Stop before any compensation that deletes production data, performs irreversible repair, or changes balances without explicit approval.
- Verify both forward execution and compensation paths with tests or reproducible evidence.

## MUST NOT
- Assume a failed HTTP call means the remote side effect did not happen.
- Retry a non-idempotent write without a deduplication/idempotency mechanism.
- Mark a saga completed while a required step has unknown outcome.
- Hide compensation failures by returning the original error only.
- Invent compensation semantics for business actions without repository/domain evidence.
- Force production repair, destructive SQL, schema change, or data deletion.

## SHOULD
- Prefer semantic compensations over literal state reversal.
- Keep forward and compensation handlers small and independently testable.
- Record correlation IDs, provider receipts, timestamps, and attempt numbers.
- Use reconciliation when external outcome is uncertain.
