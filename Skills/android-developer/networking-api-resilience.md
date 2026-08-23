# Networking and API Resilience

## Purpose
Build Android API integrations that handle latency, partial failure, version drift, retries, cancellation, and user-visible error states safely.

## When to use
Use for REST/GraphQL integrations, SDK wrappers, upload/download flows, or network incident investigation.

## Inputs
API contract, authentication model, timeout expectations, idempotency rules, error schema, connectivity assumptions, telemetry.

## Preconditions
Inspect the actual client stack and backend contract before changing retry or serialization behavior.

## Context to inspect
HTTP client configuration, interceptors, serializers, DTO mappings, repository methods, coroutine cancellation, cache policy, TLS settings, and error handling.

## Core knowledge
Mobile networks are intermittent. Retries can amplify failures and duplicate side effects. Transport success does not imply business success, and serialization must tolerate intentional contract evolution.

## Procedure
1. Classify requests as safe, idempotent, or side-effecting.
2. Define connect/read/write/call timeouts.
3. Map transport, protocol, parsing, and business errors separately.
4. Validate retry eligibility and use bounded backoff.
5. Propagate cancellation from callers.
6. Map DTOs at the data boundary.
7. Define offline and stale-data behavior.
8. Redact secrets from logs.
9. Test slow, disconnected, malformed, partial, and server-error responses.
10. Instrument latency, error categories, and retry counts.

## Decision points
Retry only transient failures when replay is safe. Cache when freshness and ownership rules are explicit. Prefer server-supported idempotency for retryable writes.

## Common failure patterns
Infinite retries, retrying validation errors, leaking tokens in logs, treating all failures as IOException, swallowing parsing errors, and blocking UI while connectivity is poor.

## Verification
Use integration tests or a mock server to exercise success, timeout, cancellation, malformed payload, retry, and duplicate-request scenarios.

## Expected output
Explicit network policy, typed error model, safe retry behavior, and test/telemetry evidence.

## Stop conditions
Escalate when API semantics are undocumented, safe replay cannot be determined, or certificate/security requirements need backend coordination.