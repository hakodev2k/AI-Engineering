# Networking and API Integration

## Purpose
Implement resilient iOS networking with explicit contracts, authentication, cancellation, decoding, caching, retries, and observability.

## When to use
Use for REST/HTTP integrations, uploads/downloads, API migrations, or network reliability defects.

## Inputs
API contract, auth scheme, error model, latency/retry requirements, privacy constraints.

## Context to inspect
URLSession configuration, request builders, Codable models, interceptors, caching, reachability assumptions, logs, tests.

## Core knowledge
Mobile networks are intermittent and expensive. Retries require idempotency awareness and bounded backoff. Transport success is distinct from application success.

## Procedure
1. Define request/response and error contracts.
2. Configure sessions for security, caching, timeouts, and background behavior.
3. Encode requests deterministically.
4. Validate status and content before decoding.
5. Map transport, protocol, decoding, auth, and domain errors separately.
6. Propagate cancellation.
7. Retry only transient/idempotent operations with limits and jitter.
8. Avoid logging secrets or sensitive payloads.
9. Add mocked protocol tests and representative integration tests.
10. Measure latency and failure rates in production telemetry.

## Decision points
Use cache policies based on freshness semantics. Use background URLSession for transfers that must outlive foreground execution.

## Common failure patterns
Blind retries, reachability as truth, token refresh storms, silent decoding fallback, unbounded downloads, and PII logging.

## Verification
Test offline, timeout, 4xx/5xx, malformed response, cancellation, auth expiry, and recovery scenarios.

## Expected output
Typed, cancellable networking with bounded resilience and observable failure behavior.

## Stop conditions
Stop when API semantics, certificate requirements, or authentication ownership are undefined.