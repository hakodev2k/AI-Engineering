# Retry and Timeout Rules

## Purpose
Prevent retries and timeouts from amplifying failures or creating duplicate financial effects.

## Scope
Provider APIs, internal services, queues, webhooks, and synchronous payment operations.

## MUST
- Every remote payment dependency MUST have explicit connection and operation timeouts.
- Retries MUST be bounded and limited to failure classes known to be safe to retry.
- Money-moving retries MUST be protected by idempotency or equivalent deduplication.
- Backoff and jitter MUST be used where retry storms could overload a dependency.
- Timeout outcomes with ambiguous provider state MUST enter reconciliation or status-check logic before a new financial action is attempted.

## MUST NOT
- MUST NOT retry deterministic validation, authentication, or business-rule failures as transient errors.
- MUST NOT use unbounded retries.
- MUST NOT assume a timed-out provider request did not execute.

## SHOULD
- Apply circuit breaking or admission control when a degraded provider would otherwise cause cascading load.

## Exceptions
Require provider-specific evidence, bounded risk, and approval.

## Verification
Inspect timeout/retry configuration and run tests for timeout-before-response, timeout-after-provider-success, and repeated transient failures.