# EF Core Rules

## Purpose
Prevent correctness and performance failures in Entity Framework Core usage.

## Scope
Applies to DbContext lifetime, tracking, querying, updates, transactions, and migrations.

## MUST
- `DbContext` lifetime MUST remain scoped to a coherent unit of work and MUST NOT be shared concurrently across threads.
- Read queries MUST use tracking intentionally; read-only paths SHOULD prefer no-tracking when entity state management is unnecessary.
- Query shapes MUST be reviewed for N+1 behavior, over-fetching, client evaluation, and unnecessary materialization.
- Concurrency-sensitive updates MUST use a defined strategy such as concurrency tokens, transactional locking, or serialized processing.
- Migrations MUST be reviewed independently from model changes before production use.

## MUST NOT
- MUST NOT call `SaveChanges` repeatedly inside large loops when batching is possible and semantics allow it.
- MUST NOT hide database round-trips behind abstractions that prevent reviewers from understanding query behavior.
- MUST NOT assume LINQ expressions translate efficiently without inspecting generated SQL for important paths.

## SHOULD
- Project only required columns for read-heavy queries.
- Prefer explicit includes/projections over accidental lazy-loading behavior.

## Exceptions
Exceptions require measured evidence, documented trade-offs, and verification of generated SQL and state behavior.

## Verification
Inspect generated SQL, query counts, integration tests, execution plans, concurrency tests, and migration scripts.