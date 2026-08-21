# EF Core Data Access

## Purpose
Implement reliable EF Core data access with correct tracking, query shape, lifetime, transactions, and persistence boundaries.

## When to use
New persistence logic, repository/service reviews, query bugs, write consistency issues, or EF Core upgrades.

## Inputs
DbContext model, schema, queries, transaction requirements, workload characteristics.

## Preconditions
Confirm provider/version and whether migrations are used.

## Context to inspect
DbContext lifetime, entity mappings, includes/projections, tracking behavior, SaveChanges boundaries, interceptors, execution strategy.

## Core knowledge
DbContext is a unit-of-work and not thread-safe; tracking has cost; projection beats loading unnecessary graphs; provider translation matters; SaveChanges is transactional for its batch.

## Procedure
1. Define read/write use case and consistency need.
2. Inspect mappings and generated SQL.
3. Use projection for read models.
4. Use `AsNoTracking` for read-only queries unless identity tracking is required.
5. Avoid broad Include graphs.
6. Bound result sets.
7. Define write boundary and concurrency behavior.
8. Use explicit transactions only when one SaveChanges is insufficient.
9. Test against the real provider.

## Decision points
Use direct DbContext when EF abstractions already fit; introduce repositories only for meaningful domain/persistence boundaries, not ceremony.

## Common failure patterns
N+1 queries, cartesian explosion, client-side assumptions, long-lived contexts, parallel DbContext use, accidental tracking, repository abstractions that hide query control.

## Verification
Inspect SQL, run integration tests on the production provider, verify row counts and transaction behavior.

## Expected output
Minimal, explicit, provider-aware persistence code.

## Stop conditions
Escalate destructive schema/migration or data-consistency changes requiring broader review.