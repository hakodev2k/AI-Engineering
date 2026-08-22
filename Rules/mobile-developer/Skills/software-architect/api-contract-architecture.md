# API Contract Architecture

## Purpose
Design stable service contracts that preserve compatibility, security, and clear ownership across system boundaries.

## When to use
Use for public/internal APIs, service-to-service integration, versioning, or contract redesign.

## Inputs
Consumer needs, domain model, existing contracts, traffic, security rules, compatibility requirements.

## Context to inspect
Current endpoints, schemas, clients, error models, authentication, pagination, idempotency, deprecation policy.

## Core knowledge
Contracts are long-lived dependencies. Good contracts expose business capabilities rather than internal persistence models and evolve compatibly where possible.

## Procedure
1. Identify consumers and use cases.
2. Define resource or capability boundaries.
3. Specify requests, responses, errors, auth, and idempotency.
4. Separate transport DTOs from internal models.
5. Define compatibility and versioning rules.
6. Standardize pagination, filtering, and correlation.
7. Document ownership and deprecation.
8. Add contract and integration tests.
9. Validate with representative consumers.

## Decision points
Prefer additive compatible evolution when possible. Version only when semantics cannot remain compatible. Use synchronous APIs when immediate response is required; messaging when decoupling is more important.

## Common failure patterns
Leaking database entities, inconsistent errors, breaking changes, implicit auth assumptions, over-fetching, unstable field semantics.

## Verification
Contract tests pass, backward compatibility is checked, and consumer scenarios are exercised.

## Expected output
A documented, testable contract with explicit compatibility and lifecycle rules.

## Stop conditions
Stop when consumer requirements or authorization semantics remain unresolved.