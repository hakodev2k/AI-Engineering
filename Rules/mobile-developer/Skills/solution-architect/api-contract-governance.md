# API Contract Governance

## Purpose
Create stable API boundaries that can evolve without unnecessary consumer breakage or organization-wide coupling.

## When to use
Use for public, partner, platform, or cross-team APIs and for major contract changes.

## Inputs
Consumer needs, domain model, compatibility policy, traffic patterns, security requirements, lifecycle expectations.

## Preconditions
Resource ownership and API audience are known.

## Context to inspect
Existing conventions, OpenAPI contracts, versioning practices, authentication, pagination/filtering standards, error model, deprecation policy.

## Core knowledge
An API is a long-lived contract, not merely a controller surface. Compatibility, semantics, idempotency, authorization, observability, and lifecycle are architecture concerns.

## Procedure
1. Define consumers and business capabilities.
2. Model contract around stable domain concepts.
3. Choose HTTP semantics or RPC style deliberately.
4. Define validation and consistent error contracts.
5. Specify authentication and authorization boundaries.
6. Design pagination, filtering, concurrency, and idempotency where relevant.
7. Define backward-compatibility rules.
8. Establish versioning and deprecation policy.
9. Define rate limiting, quotas, and observability.
10. Validate contract with representative consumers before implementation lock-in.

## Decision points
Prefer additive evolution when feasible. Version only when semantics cannot remain compatible. Avoid exposing internal persistence structures directly.

## Common failure patterns
Breaking field changes, inconsistent error models, undocumented nullability, leaking database entities, versioning every small change, missing consumer migration plan.

## Verification
Contract tests and consumer scenarios demonstrate compatibility and policy compliance.

## Expected output
Governed API contract with lifecycle and compatibility rules.

## Stop conditions
Stop when consumer impact cannot be assessed for a breaking change.