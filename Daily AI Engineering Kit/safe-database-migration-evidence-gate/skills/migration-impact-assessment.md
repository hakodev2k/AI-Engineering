# Skill: Migration Impact Assessment

## Purpose
Assess the blast radius and operational risk of a database migration before execution.

## When to use
Use for schema changes, data migrations, backfills, EF Core migrations, index/constraint changes, or application changes that depend on database rollout order.

## Inputs
- migration source and generated SQL when available;
- target engine/version;
- affected schemas/tables/columns/indexes/constraints;
- repository code that reads/writes affected objects;
- existing tests and rollout model;
- approximate table size/traffic if available;
- prior migration conventions and production constraints.

## Preconditions
- Migration intent is stated.
- Target environment is known.
- Generated SQL is available or can be produced without modifying production.

## Required context
Read the migration, affected entity/model mappings, query/write paths, nearby migrations, and relevant deployment configuration. Expand context only when evidence indicates another dependency.

## Allowed tools
Read-only repository search, git diff, build/test tools, migration SQL generation, non-production database inspection, explain/plan tools where safe, and deterministic scripts in this package.

## Constraints
- Treat missing production-size/traffic evidence as uncertainty, not safety.
- Do not execute production SQL.
- Do not infer rollback safety merely because a framework generated a `Down` migration.
- Keep facts, hypotheses, and assumptions separate.

## Process
1. Identify every changed database object and operation.
2. Classify each operation as additive, mutating, destructive, or operational-only.
3. Trace application reads/writes to affected objects and identify old/new version compatibility requirements.
4. Determine whether the change may rewrite data, scan a large object, take blocking locks, rebuild indexes, validate constraints, or change nullability/default semantics.
5. Identify data-loss paths: drop, truncate, narrowing conversion, lossy transformation, uniqueness enforcement, delete/update backfill.
6. Identify deployment-order dependency: DB-first, app-first, expand-contract, maintenance window, or atomic coordinated rollout.
7. Identify data migration characteristics: estimated rows, batching strategy, idempotency, resume behavior, reconciliation query.
8. Inspect generated SQL with `scripts/inspect-migration.py`.
9. Record available evidence and mark unavailable evidence explicitly.
10. Assign risk level: `low`, `medium`, `high`, or `critical`.
11. Define required verification and human approval points.
12. Produce or update the migration manifest.

## Expected output
A migration manifest containing affected objects, operation classes, compatibility analysis, risk level, deterministic inspection result, evidence references, and unresolved risks.

## Verification
The assessment is acceptable only when every changed object maps to at least one operation and every high/critical risk has a mitigation or is explicitly unresolved.

## Failure handling
If generated SQL cannot be obtained, continue only with lower confidence and mark that limitation; high/critical migrations without SQL evidence are blocked. If repository usage cannot be traced, stop automatic approval and request human review.

## Stop conditions
Stop when destructive behavior is unexplained, production compatibility is unknown for a rolling deployment, required evidence is unavailable for high/critical risk, or the migration requires privileges the current process does not have.