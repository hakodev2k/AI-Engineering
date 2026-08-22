# Retry-After Rules

## MUST
- Preserve the original response status, headers, request method, endpoint class, and attempt number before retrying.
- Honor a valid `Retry-After` value for configured retryable statuses.
- Cap retries at `max_retry_attempts` and cap delay at `max_delay_seconds`.
- Treat non-idempotent methods listed in `forbid_retry_methods` as approval-required unless the operation has a proven idempotency contract.
- Stop when retry budget is exhausted and report the last response as evidence.

## MUST NOT
- Retry indefinitely.
- Convert a 429/503 into success merely because a later retry passed.
- Ignore `Retry-After` to retry sooner.
- Retry POST/PATCH automatically without an explicit idempotency guarantee.
- Hide rate-limit responses from logs or verification output.

## SHOULD
- Prefer server-provided delay over local backoff.
- Add jitter outside the deterministic gate when many clients may synchronize.
- Separate transport/tool failures from application rate limiting.
- Verify the final implementation using captured or synthetic 429/503 responses.
