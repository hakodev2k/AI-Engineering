# External API Resilience

## Purpose
Integrate third-party and internal services with bounded failure behavior and predictable recovery.

## When to use
Use for outbound HTTP/RPC calls, webhooks, payment/provider integrations, and dependency-related incidents.

## Inputs
Provider contract, SLAs, rate limits, timeout guidance, idempotency support, error taxonomy, business criticality.

## Context to inspect
Client configuration, DNS/network path, connection pooling, retries, timeouts, circuit breaking, credentials, logs, and dependency metrics.

## Core knowledge
Deadlines, retries with jitter, idempotency, circuit breakers, bulkheads, rate limiting, connection reuse, fallback semantics, and dependency observability.

## Procedure
1. Classify operations by idempotency and business impact.
2. Set explicit connection and request deadlines.
3. Retry only transient failures and only within a total budget.
4. Add jitter and respect provider rate-limit signals.
5. Bound concurrency and connection pools.
6. Define circuit/fallback behavior where useful.
7. Protect credentials and sensitive payloads.
8. Instrument latency, error class, retry count, and saturation.
9. Test outage and degradation scenarios.

## Decision points
Retry reads and idempotent writes more safely than non-idempotent writes. Fail fast when fallback cannot preserve semantics.

## Common failure patterns
Infinite retries, nested retry amplification, no timeout, retrying validation errors, socket exhaustion, logging secrets, and hiding dependency failures behind stale success.

## Verification
Simulate timeouts, 429s, 5xx responses, connection failures, slow responses, and duplicate requests; confirm bounded latency and correct outcomes.

## Expected output
A dependency client with explicit resilience policy and telemetry.

## Stop conditions
Stop when provider semantics are undocumented or safe retry/idempotency behavior cannot be established.