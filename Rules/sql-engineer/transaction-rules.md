# Transaction Rules

## Purpose
Preserve atomicity and consistency while controlling contention and failure behavior.

## Scope
Explicit transactions, stored procedures, batch writes, multi-statement workflows, and transactional integration patterns.

## MUST
- Transaction boundaries MUST align with the business unit of atomicity.
- Failure paths MUST define commit, rollback, retry, and partial-effect behavior.
- Transactions MUST be kept no longer than required for correctness.
- Multi-resource workflows MUST explicitly address the absence or presence of distributed atomicity.

## MUST NOT
- MUST NOT hold transactions open across avoidable user interaction, remote calls, or unbounded processing.
- MUST NOT swallow transactional errors and continue as though a commit succeeded.
- MUST NOT retry a non-idempotent transactional operation without proving retry safety.

## SHOULD
- Acquire resources in consistent order where practical to reduce deadlocks.
- Prefer explicit transaction ownership over ambiguous nested behavior.

## Exceptions
Long-running transactions require evidence that alternatives are unsuitable, quantified operational risk, monitoring, and approval for production-critical paths.

## Verification
Test success, rollback, timeout, deadlock, cancellation, and retry cases. Inspect transaction duration, locks, logs, and persisted state after injected failures.