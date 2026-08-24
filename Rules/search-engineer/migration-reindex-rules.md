# Migration and Reindexing

## Purpose
Make schema, analyzer, engine, and corpus migrations reversible and production-safe.

## Scope
Reindexing, aliases, dual writes, backfills, cutovers, engine upgrades, and rollback.

## MUST
- Build new incompatible indexes separately from the serving index.
- Define data completeness, relevance, performance, and freshness acceptance criteria before cutover.
- Preserve a tested rollback path until the new index is proven stable.
- Reconcile document counts and critical fields before switching production traffic.
- Obtain human approval before destructive index deletion or irreversible production migration.

## MUST NOT
- Delete the last known-good index before rollback criteria expire.
- perform blind cutovers without health and quality verification.
- assume successful reindexing implies equivalent search semantics.

## SHOULD
- Use aliases or equivalent indirection for atomic/reversible cutovers.
- Stage large backfills to protect live traffic.

## Exceptions
Exceptions require explicit risk, recovery method, evidence, and production owner approval.

## Verification
Review migration plan, reconciliation, evaluation, load tests, cutover checklist, rollback exercise, and approval record.