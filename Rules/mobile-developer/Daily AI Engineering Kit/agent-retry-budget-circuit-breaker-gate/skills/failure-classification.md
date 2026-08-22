# Failure Classification Skill

## Purpose
Decide whether an agent/tool failure may be retried without turning transient recovery into duplicate or unsafe side effects.

## Inputs
Operation name, read/write semantics, exit/status code, response headers, stderr/logs, attempt history, idempotency mechanism, environment.

## Preconditions
The original failure evidence is available. Do not mutate state during classification.

## Process
1. Record the operation, target, attempt number, timestamp, exit/status code and evidence location.
2. Determine whether the operation is read-only, idempotent write, or non-idempotent write.
3. Classify the failure as `transient`, `validation`, `permission`, `environment`, `business-rule`, `unknown-outcome-write`, or `unknown`.
4. For HTTP calls, treat 408/425/429/500/502/503/504 as candidates for transient retry; honor `Retry-After`. Do not infer that every 5xx write is safe to repeat.
5. For timeouts after a write was sent, reconcile remote state before another attempt. If reconciliation is impossible, stop for human review.
6. Verify that retrying cannot exceed the configured attempt budget or bypass an open circuit.
7. Produce a decision: `retry`, `stop`, `reconcile`, or `approval-required`, with evidence and confidence.

## Expected output
Failure class, operation semantics, evidence, retry decision, next delay if applicable, remaining budget, unresolved risk.

## Verification
A retry is permitted only when the classification and operation semantics jointly establish bounded safety.

## Failure handling
Missing evidence or ambiguous write outcome => stop/reconcile. Permission failure => stop. Repeated transient failure => circuit/open escalation.

## Stop conditions
Budget exhausted, circuit open, non-retryable classification, unknown write outcome, or approval boundary reached.
