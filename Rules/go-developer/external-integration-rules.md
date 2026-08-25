# External Integration Rules

## Purpose
Bound failure propagation from remote services and external systems.

## Scope
HTTP/RPC clients, SDKs, webhooks, retries, timeouts, rate limits, and circuit behavior.

## MUST
- Remote calls MUST have explicit or inherited timeouts.
- Retries MUST be bounded, use backoff/jitter where appropriate, and respect operation idempotency.
- Client connection reuse and transport settings MUST be intentional for expected load.
- External failures MUST be classified sufficiently for retry, fallback, and user-facing behavior.

## MUST NOT
- MUST NOT retry non-idempotent effects blindly.
- MUST NOT create a new transport/client per request when reuse is required for connection efficiency.
- MUST NOT trust external payloads without validation.

## SHOULD
- Isolate vendor-specific models behind adapters when lock-in or contract volatility matters.
- Honor server retry/rate-limit signals when safe.

## Exceptions
Long or unbounded operations require protocol-specific justification, cancellation, and operational safeguards.

## Verification
Fault-injection tests, timeout/retry tests, connection metrics, contract tests, and integration telemetry.