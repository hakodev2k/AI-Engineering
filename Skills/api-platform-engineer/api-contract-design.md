# API Contract Design

## Purpose
Create stable, consumer-oriented API contracts with explicit semantics, compatibility rules, and operational behavior.

## When to use
Use for new APIs, major contract changes, or reviews of inconsistent interfaces.

## Inputs
Requirements, consumer workflows, domain model, existing conventions, compatibility constraints.

## Context to inspect
Inspect neighboring APIs, schemas, error models, pagination, authentication, naming, and known consumer dependencies.

## Core knowledge
Contracts are long-lived integration boundaries. Good contracts expose domain capabilities without leaking implementation details and define success, failure, idempotency, ordering, and consistency semantics.

## Procedure
1. Identify consumers and business operations.
2. Define resources or operations around stable domain concepts.
3. Select protocol and interaction style.
4. Specify requests, responses, validation, and errors.
5. Define identifiers, timestamps, nullability, enums, pagination, and filtering.
6. Specify auth and authorization expectations.
7. Define idempotency and concurrency semantics where needed.
8. Evaluate backward compatibility.
9. Produce a machine-readable contract where supported.
10. Review with representative consumers before implementation.

## Decision points
Prefer resource-oriented REST for broadly interoperable request/response APIs; RPC can fit action-heavy internal interfaces; asynchronous messaging fits decoupled workflows. Avoid exposing database schemas directly.

## Common failure patterns
Ambiguous optional fields, unstable enums, inconsistent errors, breaking renames, unbounded lists, hidden side effects, and implementation-specific contracts.

## Verification
Validate schema syntax, examples, negative cases, compatibility checks, and consumer acceptance. Confirm implementation behavior matches the published contract.

## Expected output
A precise, reviewable, machine-testable API contract.

## Stop conditions
Stop when core semantics, consumer expectations, authorization, or compatibility requirements are unresolved.