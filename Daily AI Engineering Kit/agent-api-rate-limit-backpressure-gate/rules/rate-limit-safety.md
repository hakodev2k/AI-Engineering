# Rate Limit & Backpressure Safety Rules

## MUST
- Bound outbound concurrency and pending work explicitly.
- Classify retryable failures; honor provider retry/reset metadata when contractually defined.
- Use bounded retry attempts/time and jitter for concurrent clients.
- Preserve evidence for throttling, saturation, and recovery tests.
- Verify request pressure does not grow during repeated throttling.
- Require approval before production configuration/deployment, infrastructure changes, breaking contracts, or large dependency upgrades.
- Record remaining risks and provider assumptions.

## MUST NOT
- Retry all exceptions/status codes indiscriminately.
- Use infinite retries, recursion without an attempt budget, or unbounded queues/fan-out for remote calls.
- Ignore `Retry-After` solely to improve latency.
- Increase production quotas, worker counts, concurrency, or timeout budgets without approval.
- Hide overload by weakening assertions, dropping errors silently, or deleting evidence.
- Log secrets, authorization headers, or sensitive response bodies.

## SHOULD
- Prefer bounded channels/semaphores/rate limiters close to the downstream boundary.
- Add full or decorrelated jitter to exponential backoff.
- Separate admission control from retry policy.
- Expose metrics for in-flight requests, queue depth, 429/5xx, retry attempts, rejected work, and latency.
- Test recovery after throttling ends to avoid permanently stuck/open states.
