# Rate Limit Investigation

## Purpose
Determine whether request failures are caused by provider quotas, burst concurrency, client retry behavior, or unrelated service errors.

## When to use
Use after repeated HTTP 429/503 responses, quota alerts, elevated latency caused by retries, or when adding a new third-party API integration.

## Inputs
- Request/response logs with timestamps and status codes.
- Provider rate-limit headers and published limits when available.
- Current retry and concurrency settings.
- Request volume by endpoint/tenant/job.

## Preconditions
Do not use production credentials for experiments. Use read-only telemetry first.

## Allowed tools
Repository search, logs, metrics, test clients, provider documentation, and `scripts/adaptive_throttle.py`.

## Constraints
Do not increase provider quotas, production concurrency, or retry counts without explicit approval. Never retry authentication, validation, or permanent business errors merely to make a run pass.

## Procedure
1. Identify the failing API call and the first 429/503 in the causal chain.
2. Capture rate-limit headers, `Retry-After`, request IDs, timestamp, endpoint, tenant, and concurrency.
3. Separate provider throttling from client-side timeouts and downstream 5xx failures.
4. Calculate observed request rate and burst size around the failure window.
5. Inspect retry code for unbounded loops, synchronized retries, missing jitter, and ignored `Retry-After`.
6. Compare observed limits to `config/rate-limit-policy.yaml`.
7. Reproduce with a safe synthetic status sequence using `python scripts/adaptive_throttle.py --statuses 429,429,200 --retry-after 1`.
8. Form one hypothesis at a time: quota exhausted, burst too high, concurrency too high, retry storm, or provider degradation.
9. Validate each hypothesis using logs/metrics rather than assumptions.
10. Recommend the smallest safe policy or code change.
11. Record residual uncertainty and evidence.

## Expected output
A finding with cause, evidence, affected component, confidence, recommended change, and verification plan.

## Verification
The identified cause must explain timestamps, statuses, and rate/concurrency evidence. Synthetic gate behavior must match the intended retry policy.

## Failure handling
If headers or metrics are missing, mark the cause as unconfirmed and request instrumentation rather than inventing a provider limit.

## Stop conditions
Stop when the failure is not rate-limit related, evidence is insufficient for a safe change, or a proposed fix requires production/quota changes awaiting approval.
