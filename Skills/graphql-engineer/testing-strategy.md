# GraphQL Testing Strategy

## Purpose
Build layered tests that protect schema contracts, authorization, resolver integration, data behavior, and production-critical operations.

## When to use
Use when establishing test coverage or changing schema, resolvers, federation, security, or persistence behavior.

## Inputs
Schema, critical operations, client contracts, domain services, data sources, and failure scenarios.

## Context to inspect
Inspect existing unit/integration tests, schema snapshots, persisted operations, test data, auth fixtures, and CI schema checks.

## Core knowledge
Resolver unit tests alone cannot prove GraphQL correctness. High-value coverage executes operations through the GraphQL engine, validating parsing, coercion, authorization, nullability, errors, and data integration.

## Procedure
1. Identify critical consumer operations and risk areas.
2. Add schema validation and breaking-change checks.
3. Unit-test pure domain logic outside resolvers.
4. Integration-test queries/mutations through the GraphQL execution layer.
5. Cover authorization roles and tenant boundaries.
6. Test invalid variables and input coercion.
7. Test null/error propagation and partial data.
8. Verify DataLoader batching where performance correctness matters.
9. Exercise real database behavior for query-sensitive paths.
10. Add federation composition/contract tests when applicable.
11. Keep representative client operations in regression coverage.

## Decision points
Prefer behavior assertions over brittle full-response snapshots except where schema/contract snapshots add clear value. Mock external dependencies selectively; use realistic persistence for data-access semantics.

## Common failure patterns
Only testing resolver methods, snapshotting volatile data, no negative authorization tests, mocks that hide N+1 behavior, and no schema compatibility gate.

## Verification
CI should fail on intended contract violations and tests should reproduce known failure modes. Confirm coverage includes both implementation and observable API behavior.

## Expected output
A risk-based GraphQL test suite protecting contracts, security, and integration behavior.

## Stop conditions
Stop if tests require destructive shared-environment actions or cannot isolate sensitive production data.