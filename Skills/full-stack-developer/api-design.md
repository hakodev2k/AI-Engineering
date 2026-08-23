# API Design

## Purpose
Design evolvable HTTP APIs that express domain operations clearly and safely.

## When to use
Creating endpoints, changing contracts, or reviewing an API surface.

## Inputs
Consumer needs, domain rules, data model, security constraints, compatibility requirements.

## Context to inspect
Existing routes, conventions, OpenAPI contracts, authentication, errors, pagination, versioning, clients.

## Core knowledge
API contracts outlive implementations. Resource modeling, idempotency, validation, authorization, status semantics, pagination, compatibility, and observability are first-class concerns.

## Procedure
1. Identify consumer goal and resource boundary.
2. Select method and route semantics.
3. Define request and response DTOs independent of persistence entities.
4. Define validation and authorization.
5. Specify errors and status codes.
6. Address idempotency and concurrency for writes.
7. Add pagination/filtering/sorting where justified.
8. Evaluate backward compatibility.
9. Document contract and examples.
10. Implement contract and integration tests.

## Decision points
Use synchronous APIs for immediate bounded work; asynchronous workflows for long-running or decoupled operations. Version only when compatible evolution is impossible.

## Common failure patterns
Leaking database models, ambiguous errors, missing authorization, unbounded collections, breaking changes, non-idempotent retry behavior, and chatty APIs.

## Verification
Contract tests pass, authorization boundaries are tested, malformed inputs fail correctly, retries behave safely, and documented examples match runtime behavior.

## Expected output
A documented, tested, consumer-oriented API contract.

## Stop conditions
Stop when business semantics, consumers, or authorization policy are materially unresolved.