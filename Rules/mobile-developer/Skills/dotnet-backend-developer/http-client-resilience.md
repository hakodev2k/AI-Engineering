# HTTP Client Resilience

## Purpose
Build outbound HTTP integrations with correct connection reuse, timeout, retry, cancellation, rate-limit, and failure semantics.

## When to use
Third-party APIs, service-to-service calls, webhooks, or intermittent outbound failures.

## Inputs
Remote API contract, SLA, idempotency semantics, rate limits, auth, latency/failure data.

## Context to inspect
`HttpClientFactory`, handlers, DNS/proxy behavior, timeout layers, retry policy, serialization, correlation, metrics.

## Core knowledge
Reuse handlers/connections; distinguish connect/request/deadline timeouts; retries can amplify outages; only retry safe/idempotent operations unless protected by idempotency keys.

## Procedure
1. Define remote dependency budget and failure contract.
2. Use managed HttpClient lifetime.
3. Set explicit request deadlines.
4. Propagate cancellation.
5. Retry only classified transient failures with backoff/jitter.
6. Respect `Retry-After` and rate limits.
7. Bound total retry duration.
8. Consider circuit breaking when repeated failures would overload systems.
9. Record dependency latency/status without sensitive payloads.

## Decision points
Retry GET/HEAD more readily than mutation calls. Use hedging only for proven latency-sensitive idempotent requests and with capacity awareness.

## Common failure patterns
New HttpClient per request, infinite retries, stacked timeout policies, retrying 4xx blindly, logging tokens, no dependency metrics.

## Verification
Fault injection, timeout tests, retry-count assertions, dependency dashboards.

## Expected output
Bounded and observable remote calls with safe retry semantics.

## Stop conditions
Escalate ambiguous mutation idempotency or contractual rate-limit/SLA changes.