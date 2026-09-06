# API Integration Design

## Purpose
Integrate workflows with external APIs in a way that is contract-aware, resilient, secure, and maintainable.

## When to use
Use when a workflow reads or writes through REST, GraphQL, RPC, or vendor SDK endpoints.

## Inputs
API documentation, authentication method, schemas, quotas, error model, pagination rules, SLAs, and sample payloads.

## Preconditions
Confirm authorized access and identify the system of record.

## Context to inspect
Inspect current API versions, existing adapters, credential scope, retry guidance, rate limits, idempotency support, pagination, webhooks, and deprecation notices.

## Core knowledge
Treat APIs as fallible distributed dependencies. HTTP success does not always imply business success. Retry only operations known to be safe or protected by idempotency. Contracts evolve independently.

## Procedure
1. Define the required business operation and authoritative endpoint.
2. Validate authentication and least-privilege scope.
3. Capture request, response, and error contracts.
4. Define timeouts and rate-limit behavior.
5. Determine idempotency and retry safety per operation.
6. Implement pagination and continuation correctly.
7. Validate response semantics rather than status alone.
8. Normalize external errors into workflow-level categories.
9. Isolate vendor-specific mapping in an adapter boundary.
10. Add structured telemetry without logging secrets.
11. Test normal, empty, malformed, throttled, timeout, and dependency-failure cases.

## Decision points
Use a native connector only when its behavior and version support are adequate; otherwise prefer a direct API adapter. Cache reads only when staleness is acceptable.

## Common failure patterns
Unbounded retries, missing pagination, broad tokens, silent schema drift, assuming 200 means success, and coupling domain logic to vendor response shapes.

## Verification
Run integration tests against a safe environment or contract simulator and confirm errors, pagination, retries, and permissions behave as designed.

## Expected output
A documented integration contract and implementation with bounded failure handling, telemetry, tests, and ownership.

## Stop conditions
Stop on undocumented destructive behavior, insufficient permissions, ambiguous API semantics, or unresolved data-handling constraints.