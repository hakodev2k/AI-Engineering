# Inference Reliability

## Purpose
Make model inference resilient to provider errors, rate limits, malformed outputs, timeouts, and transient quality failures.

## When to use
Use for any production AI endpoint or background workflow that depends on external or local model inference.

## Inputs
Provider limits, timeout budget, retry policy, model endpoints, fallback models, idempotency requirements, SLOs.

## Preconditions
Classify failures as transient, permanent, semantic, or policy-related.

## Context to inspect
HTTP client configuration, SDK retries, queue behavior, concurrency, circuit breakers, fallback logic, schema validation, telemetry.

## Core knowledge
Retries improve availability only for transient failures and can amplify overload. Reliability requires bounded timeouts, jittered backoff, rate-limit handling, circuit breaking, concurrency control, fallback decisions, and semantic validation.

## Procedure
1. Define end-to-end latency and retry budgets.
2. Set explicit connection/request timeouts.
3. Retry only known transient errors with exponential backoff and jitter.
4. Respect provider retry-after signals.
5. Bound concurrency and queue depth.
6. Validate outputs before accepting success.
7. Define fallback models or degraded behavior for critical paths.
8. Add circuit breaking when repeated provider failures would cause cascades.
9. Preserve idempotency for retried workflows.
10. Measure availability, timeout rate, retry amplification, and fallback frequency.

## Decision points
Prefer fast failure over retries when the user can recover cheaply. Use fallback only when its quality and safety characteristics are known.

## Common failure patterns
Nested SDK/application retries, no timeout, retrying invalid prompts, unbounded queues, fallback loops, and treating HTTP 200 as semantic success.

## Verification
Fault-inject timeouts, 429s, 5xx responses, malformed outputs, and provider outages; confirm bounded recovery.

## Expected output
A documented reliability policy with tested timeouts, retries, fallback, and overload controls.

## Stop conditions
Stop when retry/fallback behavior can duplicate irreversible work or required provider guarantees are unknown.