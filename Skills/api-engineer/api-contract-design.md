# API Contract Design

## Purpose
Design stable, consumer-oriented API contracts that express business capabilities without leaking implementation details.

## When to use
Use for new endpoints, major contract changes, or API standardization.

## Inputs
Consumer use cases, domain rules, existing conventions, compatibility constraints, and data sensitivity.

## Context to inspect
Existing routes, schemas, error format, authentication, versioning, pagination, and downstream dependencies.

## Core knowledge
Contracts are long-lived boundaries. Prefer explicit resource semantics, predictable naming, bounded payloads, machine-readable errors, and backward-compatible evolution.

## Procedure
1. Identify consumers and business outcomes.
2. Define resources and operations.
3. Choose methods and status codes by semantics.
4. Define request, response, validation, and error schemas.
5. Specify pagination, filtering, sorting, and idempotency where relevant.
6. Review authorization and sensitive fields.
7. Check compatibility and operational limits.
8. Document examples and edge cases.
9. Validate with consumers before implementation.

## Decision points
Choose synchronous APIs for immediate bounded work; prefer asynchronous workflows when completion is long-running or failure-prone. Avoid exposing persistence models directly.

## Common failure patterns
Chatty contracts, ambiguous nullability, unstable field meanings, inconsistent errors, unbounded collections, and implementation leakage.

## Verification
Validate the contract against acceptance cases, schema tooling, consumer examples, security rules, and compatibility tests.

## Expected output
A reviewable API contract with explicit semantics and constraints.

## Stop conditions
Escalate when ownership, consumer requirements, or security classification is unresolved.