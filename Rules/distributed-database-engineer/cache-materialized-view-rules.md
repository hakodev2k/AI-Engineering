# Cache and Materialized View Rules

## Purpose
Prevent stale derived data from violating correctness while controlling read cost.

## Scope
Caches, materialized views, denormalized projections, and read models.

## MUST
- Derived data MUST define source of truth, freshness target, invalidation/update mechanism, and repair path.
- Cache keys MUST include all dimensions that affect returned semantics.
- Materialized views MUST tolerate duplicate or reordered update delivery where applicable.
- Critical stale-data behavior MUST be explicitly tested.

## MUST NOT
- MUST NOT treat cache invalidation as best-effort when stale values can violate authorization or financial invariants.
- MUST NOT make a cache the accidental sole copy of durable state.

## SHOULD
- Derived stores SHOULD be rebuildable from authoritative data when practical.

## Exceptions
Non-rebuildable projections require independent durability and recovery controls.

## Verification
Run rebuild tests, freshness monitoring, invalidation tests, and failure-mode exercises.