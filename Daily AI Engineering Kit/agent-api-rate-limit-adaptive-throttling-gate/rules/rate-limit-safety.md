# Rate Limit Safety Rules

## MUST
- Treat HTTP 429 as throttling evidence and capture `Retry-After` plus provider rate-limit headers when present.
- Bound retries by both attempt count and total wait budget.
- Apply jitter to exponential backoff when `Retry-After` is unavailable.
- Keep concurrency inside configured minimum and maximum limits.
- Preserve request IDs, timestamps, endpoint, status, retry count, and delay as verification evidence.
- Ensure only one layer owns retries for a logical operation unless nested retry budgets are explicitly proven safe.
- Require independent verification after an implementation change.
- Require human approval before increasing provider quota, changing production limits, or bypassing the gate.

## MUST NOT
- Retry 400, 401, 403, 404, 409, or 422 solely to overcome rate limiting.
- Retry indefinitely or use `retry until successful` behavior.
- Ignore a valid `Retry-After` header without documented provider-specific evidence.
- Increase concurrency immediately after a single successful request following throttling.
- Log API keys, bearer tokens, cookies, or request bodies containing secrets while collecting rate-limit evidence.
- Change production configuration, provider plans, or quotas without explicit approval.
- Add a second retry loop around an already retrying SDK without calculating the combined maximum attempts and wait time.

## SHOULD
- Prefer adaptive concurrency reduction over fixed sleeps for burst-driven throttling.
- Use provider request IDs to correlate throttling with support or provider telemetry.
- Keep provider-specific behavior in configuration or a narrow adapter.
- Export metrics for 429 rate, retry attempts, cumulative wait, concurrency, and exhausted retry budgets.
