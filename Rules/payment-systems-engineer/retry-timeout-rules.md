# Retry and Timeout Rules

## Purpose
Bound uncertainty and prevent retry storms or duplicate financial operations.

## Scope
All synchronous and asynchronous payment-provider calls and internal financial commands.

## MUST
- Every remote operation MUST define an explicit timeout appropriate to its latency budget.
- Retry eligibility MUST depend on operation idempotency and failure class.
- Retries MUST use bounded attempts with backoff and jitter where repeated contention is possible.
- Indeterminate outcomes MUST enter a recoverable state that can be reconciled before another financial effect is attempted.
- Retry metrics MUST distinguish initial attempts from retries.

## MUST NOT
- MUST NOT retry authentication, validation, hard-decline, or deterministic business failures as transient failures.
- MUST NOT use unbounded retries.
- MUST NOT allow nested retry layers to multiply attempts without a documented global budget.

## SHOULD
- Retry budgets SHOULD be coordinated across application, queue, SDK, and infrastructure layers.

## Exceptions
Exceptions require evidence that additional attempts cannot amplify financial or availability risk.

## Verification
Inspect timeout configuration, retry matrices, failure classification tests, indeterminate-state handling, and telemetry under simulated provider degradation.