# API Contract Integration

## Purpose
Integrate frontend code with backend APIs using explicit contracts, compatibility rules, and resilient error semantics.

## When to use
Use for new endpoints, API version changes, generated clients, or frontend/backend integration defects.

## Inputs
OpenAPI/GraphQL schema, auth requirements, error model, pagination/filtering rules.

## Preconditions
Confirm authoritative contract and environment/version.

## Context to inspect
Client generation, DTOs, adapters, date/number handling, error translation, pagination, retries.

## Core knowledge
Transport DTOs are not always UI models. External data requires runtime trust boundaries, consistent serialization assumptions, and backward-compatible evolution.

## Procedure
1. Inspect authoritative schema.
2. Generate or define transport types consistently.
3. Create adapters for UI/domain needs when semantics differ.
4. Handle nullability, dates, enums, pagination, and error shapes explicitly.
5. Define retry only for safe transient failures.
6. Surface validation/auth/conflict errors distinctly.
7. Add contract/integration tests for critical paths.
8. Verify compatibility during backend rollout.

## Decision points
Use generated clients when schema quality and tooling are stable; use thin handwritten clients when generation creates more friction than safety.

## Common failure patterns
Duplicated DTO assumptions, timezone bugs, enum breakage, retrying validation failures, treating all non-2xx responses identically.

## Verification
Contract tests, representative error responses, pagination edge cases, and staged backend/frontend version combinations.

## Expected output
Stable frontend/backend integration with explicit compatibility handling.

## Stop conditions
Stop if backend contract is undocumented or changes incompatibly without coordination.