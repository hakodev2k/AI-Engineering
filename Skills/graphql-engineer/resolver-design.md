# Resolver Design

## Purpose
Build resolvers that are thin, deterministic, secure, observable, and efficient across nested GraphQL execution.

## When to use
Use when implementing or reviewing field, query, mutation, or subscription resolvers.

## Inputs
Schema field, domain services, data sources, request context, authorization rules, and performance expectations.

## Context to inspect
Inspect resolver conventions, dependency boundaries, request-scoped context, cancellation, error mapping, batching, and downstream calls.

## Core knowledge
Resolvers participate in a graph execution plan and may run many times per request. Business rules should normally live in domain/application services rather than resolver glue. Resolver behavior must respect field nullability and request cancellation.

## Procedure
1. Confirm the field contract and authorization requirement.
2. Identify the minimal application operation needed.
3. Keep orchestration separate from domain logic.
4. Propagate cancellation and request context.
5. Batch or cache repeated entity loads where appropriate.
6. Avoid hidden sequential downstream waterfalls.
7. Map expected domain failures to intentional GraphQL errors or payload states.
8. Avoid leaking sensitive exception details.
9. Add tracing around expensive downstream work.
10. Test normal, unauthorized, missing-data, and dependency-failure paths.

## Decision points
Resolve directly for cheap local values; delegate to services for business operations. Use request-scoped batching for repeated keyed loads, not global caches that can cross authorization boundaries.

## Common failure patterns
Business logic in resolvers, N+1 data access, swallowed cancellation, per-field network calls, unsafe shared caches, and generic exception exposure.

## Verification
Measure resolver call counts and downstream operations on representative nested queries. Verify errors, null propagation, authorization, cancellation, and tests.

## Expected output
A focused resolver implementation with bounded downstream work and clear failure semantics.

## Stop conditions
Stop if schema semantics, authorization ownership, or data-source guarantees are unknown.