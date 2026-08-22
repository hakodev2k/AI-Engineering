# Design Quarantine Path

## Purpose
Create a bounded failure path that protects queue throughput while preserving evidence and recoverability.

## Inputs
Investigation report, broker capabilities, retry policy, idempotency guarantees, retention requirements.

## Procedure
1. Separate transient retries from deterministic poison-message handling.
2. Set a finite delivery-attempt threshold; default package value is 5.
3. Apply bounded exponential backoff only to retryable failures; maximum agent-directed transient retries is 3.
4. Quarantine after threshold or immediately for explicitly non-retryable validation failures when broker semantics allow it.
5. Store metadata: message id/type, payload hash, error fingerprint, first/last failure timestamps, handler version, attempt count and quarantine reason. Do not store raw payload by default.
6. Make acknowledgement order explicit: side effect must be committed before success acknowledgement; failed processing must not acknowledge as success.
7. Require an idempotency key or equivalent proof before replay.
8. Make replay disabled by default, human-approved, bounded to 25 messages per batch, observable and auditable.
9. Add metrics for failures, retries, quarantines, replay outcomes and quarantine age.
10. Add tests for transient recovery, deterministic failure, duplicate delivery and replay.

## Expected output
Implementation plan plus tests and operational evidence.

## Verification
Demonstrate that one poison message cannot create an infinite retry loop or block healthy messages, and that duplicate/replayed delivery does not duplicate committed side effects.

## Stop conditions
Stop before changing production broker policy, retention, secrets, infrastructure, or replaying real messages without explicit approval.