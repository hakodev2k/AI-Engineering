# Concurrency and Idempotency Rules

## Purpose
Prevent duplicate, overlapping, or reordered pipeline execution from causing unsafe effects.

## Scope
Concurrent builds, deployments, retries, reruns, locks, and cancellation.

## MUST
- Mutating deployment jobs MUST define behavior for duplicate and concurrent execution.
- Production deployments to the same target MUST be serialized or otherwise proven safe under concurrency.
- Retried steps with external side effects MUST be idempotent or protected by durable deduplication.
- Cancellation MUST leave resources in a known recoverable state.
- Lock ownership and timeout behavior MUST be observable.

## MUST NOT
- MUST NOT assume a CI retry executes exactly once.
- MUST NOT allow stale deployment runs to overwrite a newer approved release.
- MUST NOT break locks manually without verifying current ownership and impact.

## SHOULD
- Superseded non-production validation SHOULD be cancellable to reduce waste.
- Idempotency keys SHOULD bind to stable release identities.

## Exceptions
Document why concurrency is safe, evidence, failure behavior, and approval for production impact.

## Verification
Run duplicate/reordered execution tests, inspect locks and cancellation paths, simulate retries, and confirm stale releases cannot replace newer ones.