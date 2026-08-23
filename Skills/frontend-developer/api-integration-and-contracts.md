# API Integration and Contracts

## Purpose
Integrate frontend applications with backend services using explicit contracts, compatibility handling, authentication, error semantics, and safe evolution practices.

## When to use
Use when adding or changing REST/GraphQL integrations, generated clients, webhooks surfaced to UI, or diagnosing frontend-backend contract drift.

## Inputs
API specification, authentication model, sample payloads, error schema, versioning policy, and frontend requirements.

## Context to inspect
Client abstractions, generated types, base URLs/configuration, auth interceptors, serialization, pagination, error mapping, and contract tests.

## Core knowledge
Static frontend types do not guarantee remote payload validity. API contracts include status/error semantics, nullability, pagination, ordering, concurrency, and compatibility—not just happy-path JSON shape.

## Procedure
1. Read the authoritative API contract and representative responses.
2. Identify required auth scopes and server authorization behavior.
3. Define runtime validation for untrusted/unstable boundaries where risk warrants it.
4. Centralize transport concerns without hiding domain semantics.
5. Map errors into stable application categories.
6. Implement pagination/filter/sort according to server semantics.
7. Handle optional/new fields compatibly.
8. Define cancellation, timeout, retry, and idempotency behavior.
9. Add contract/integration tests for critical payloads.
10. Verify against a real compatible service version.

## Decision points
Generate clients when the specification is authoritative and generation improves consistency; use focused handwritten clients when generated surfaces are excessive or the API contract is incomplete. Validate runtime payloads most strongly at high-risk external boundaries.

## Common failure patterns
Duplicated endpoint strings, assuming 200-only behavior, trusting TypeScript interfaces at runtime, frontend-side permission assumptions, incorrect pagination, and silently swallowing contract changes.

## Verification
Representative real responses deserialize correctly, known errors map correctly, auth failures are handled, compatibility cases are tested, and network traces match the documented contract.

## Expected output
A maintainable integration boundary with explicit transport, domain, error, and compatibility semantics.

## Stop conditions
Escalate when the authoritative API contract is unavailable, authentication requirements conflict, or destructive operations lack idempotency/concurrency semantics.