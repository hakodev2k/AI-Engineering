# Failure and Retry
## Purpose
Handle transient and permanent failures without data loss or retry storms.
## Scope
Retries, poison events, dead-letter handling, and circuit breaking.
## MUST
- Retryable and non-retryable failures MUST be distinguished by explicit policy.
- Retries MUST be bounded and use backoff/jitter where contention is possible.
- Poison events MUST be observable and retained or quarantined with enough context for investigation.
## MUST NOT
- Permanent failures MUST NOT loop indefinitely.
- Exceptions MUST NOT be swallowed while advancing offsets or checkpoints unless loss is explicitly accepted.
## SHOULD
- Failure handling SHOULD preserve correlation identifiers without sensitive payload leakage.
## Exceptions
Intentional drop policies require documented business acceptance.
## Verification
Inject transient, permanent, malformed, and downstream failures and verify retry counts, progress, alerts, and retained evidence.