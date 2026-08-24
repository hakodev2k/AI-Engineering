# API Contract Design

## Purpose
Design stable, evolvable service contracts that express business semantics and protect consumers from accidental implementation coupling.

## When to use
Use for new or changed HTTP/RPC APIs, public integration boundaries, and compatibility reviews. Do not redesign a stable contract without a concrete requirement.

## Inputs
Requirements, consumers, existing contracts, domain model, authorization rules, latency/error expectations, compatibility constraints.

## Context to inspect
Inspect neighboring endpoints, versioning conventions, schemas, client usage, validation, telemetry, and deployment topology before proposing changes.

## Core knowledge
Resource modeling, HTTP semantics, idempotency, pagination, filtering, error models, schema evolution, backward compatibility, validation, and least-privilege authorization.

## Procedure
1. Identify consumers and business outcomes.
2. Define resource/operation boundaries independent of persistence models.
3. Choose protocol and method semantics.
4. Specify request, response, validation, errors, and authorization.
5. Define idempotency and concurrency behavior for writes.
6. Add pagination/filtering only where needed.
7. Compare against existing conventions and compatibility promises.
8. Implement the smallest coherent contract.
9. Add contract and integration tests.
10. Document observable behavior and migration impact.

## Decision points
Prefer synchronous APIs when callers require an immediate result; prefer asynchronous messaging for long-running or decoupled workflows. Version only when compatible evolution is insufficient.

## Common failure patterns
Leaking database entities, ambiguous errors, unbounded collections, missing authorization, non-idempotent retries, silent breaking changes, and over-generalized endpoints.

## Verification
Verify schema, status/error semantics, authorization boundaries, compatibility, representative client behavior, automated tests, and production telemetry fields.

## Expected output
A documented, tested contract with explicit compatibility and operational behavior.

## Stop conditions
Stop when consumer requirements are contradictory, ownership is unclear, security approval is required, or a breaking change lacks a migration plan.