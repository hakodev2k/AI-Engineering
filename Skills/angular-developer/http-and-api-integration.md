# HTTP and API Integration

## Purpose
Integrate Angular applications with HTTP APIs using typed contracts, consistent errors, cancellation, and maintainable boundaries.

## When to use
Use when adding or reviewing API clients, interceptors, request workflows, or backend integration.

## Inputs
API specification, authentication scheme, error contract, latency expectations, and feature requirements.

## Context to inspect
Inspect HttpClient usage, interceptors, DTOs, mapping, retries, caching, loading states, and environment configuration.

## Core knowledge
Transport DTOs are external contracts, not automatically domain/view models. Interceptors suit cross-cutting transport concerns; feature behavior belongs near the feature.

## Procedure
1. Confirm API contract and failure semantics.
2. Define typed request/response DTOs.
3. Encapsulate endpoints behind focused feature clients.
4. Map transport data when UI/domain shape differs.
5. Apply auth, correlation, and common headers centrally when appropriate.
6. Handle timeout, cancellation, and errors explicitly.
7. Retry only safe transient operations.
8. Test success, validation errors, auth failures, timeout, and malformed responses.

## Decision points
Map DTOs when external contracts are volatile or semantically different. Cache only when freshness semantics are defined.

## Common failure patterns
Scattered URLs, blanket retries, leaking backend DTOs everywhere, swallowed errors, duplicate requests, and environment-specific constants in code.

## Verification
Inspect network behavior and tests; confirm cancellation, errors, headers, and payload mappings.

## Expected output
A typed and resilient API integration boundary.

## Stop conditions
Stop when API contract, authentication requirements, or idempotency semantics are unknown.