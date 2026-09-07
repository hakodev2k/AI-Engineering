# Persistence and ORM Rules

## Purpose
Keep persistence behavior correct, explicit, and performant across Java ORM usage.

## Scope
Applies to JPA/Hibernate or equivalent ORM-backed persistence.

## MUST
- Entity identity, ownership, cascade behavior, fetch strategy, and transaction boundaries MUST be intentional.
- Queries on production-scale paths MUST be assessed for cardinality, round trips, and index support.
- Lazy loading MUST occur only within controlled persistence boundaries.
- Write operations MUST preserve domain and database integrity constraints.
- Bulk operations MUST account for persistence-context staleness and memory growth.

## MUST NOT
- MUST NOT expose persistence entities as public API contracts by default.
- MUST NOT rely on implicit N+1 query behavior on latency-sensitive or collection-heavy paths.
- MUST NOT use eager loading as a blanket fix for query-count problems.

## SHOULD
- Prefer explicit projections for read paths that require only subsets of data.
- Keep mappings simple enough that generated SQL remains understandable.

## Exceptions
Complex mappings or intentionally broad fetches require query evidence, bounded result size, and performance validation.

## Verification
Inspect generated SQL, query counts, execution plans, ORM statistics where available, integration tests, transaction tests, and representative load tests.