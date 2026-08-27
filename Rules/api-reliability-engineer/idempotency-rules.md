# Idempotency Rules

## Purpose
Prevent duplicate externally visible effects when requests are repeated because of retries, network ambiguity, or client behavior.

## Scope
Applies to mutating API operations, event-triggered API work, and retryable workflows.

## MUST
- Operations advertised as idempotent MUST produce equivalent externally observable effects for repeated equivalent requests within the documented scope.
- Idempotency keys MUST be scoped, validated, stored durably enough for the retry window, and bound to the original operation semantics.
- A reused key with materially different request content MUST be rejected or deterministically handled.
- Duplicate suppression MUST be atomic with, or safely coordinated with, the protected side effect.

## MUST NOT
- MUST NOT infer that a request failed merely because the client did not receive a response.
- MUST NOT rely only on in-memory deduplication where process loss can cause duplicate durable effects.
- MUST NOT advertise idempotency without tests covering concurrent duplicates and ambiguous failures.

## SHOULD
- APIs SHOULD document key lifetime and replay behavior.
- Natural business identifiers SHOULD be used when they provide stronger uniqueness guarantees than synthetic keys.

## Exceptions
Exceptions require explicit duplicate-risk acceptance, consumer guidance, recovery procedures, and approval for financially or operationally material effects.

## Verification
Run concurrent replay, timeout-after-commit, process-restart, and key-reuse tests; inspect persistence constraints and production duplicate metrics.