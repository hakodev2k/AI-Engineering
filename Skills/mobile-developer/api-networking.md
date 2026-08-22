# API Networking

## Purpose
Build reliable, observable, secure mobile API communication under variable networks.

## When to use
Adding or reviewing HTTP/API integrations.

## Inputs
API contract, auth scheme, client code, network requirements.

## Context to inspect
Serialization, timeouts, retries, cancellation, caching, TLS, error mapping, telemetry.

## Core knowledge
Mobile networks are intermittent and expensive. Transport success differs from business success; retries require idempotency awareness.

## Procedure
1. Validate contract and compatibility.
2. Define request/response models and error taxonomy.
3. Configure bounded timeouts and cancellation.
4. Add retries only for safe transient failures with jitter/backoff.
5. Handle connectivity changes without assuming reachability.
6. Protect credentials and sensitive payloads.
7. Add correlation and sanitized diagnostics.
8. Test slow, offline, malformed, expired-auth, and server-failure paths.

## Decision points
Cache when freshness permits; retry only operations proven safe or idempotent.

## Common failure patterns
Infinite retries, no timeout, trusting HTTP 200 alone, leaking tokens in logs, coupling transport DTOs to UI.

## Verification
Contract tests, network conditioning, cancellation tests, telemetry inspection.

## Expected output
Resilient client behavior with explicit failure semantics.

## Stop conditions
Escalate incompatible contracts, certificate/security ambiguity, or unsafe retry semantics.