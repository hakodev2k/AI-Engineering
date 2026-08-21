# Skill: Database Change

## Purpose
Plan and implement safe relational database changes for .NET services using EF Core or explicit SQL while protecting data integrity, availability, and rollback options.

## Trigger
Use when a feature or defect requires schema, index, query, migration, or data-shape changes.

## Inputs
- Required data behavior
- Current schema and mappings
- Query patterns and expected volume
- Deployment topology
- Backward/forward compatibility requirements
- Backup and rollback constraints

## Procedure
1. Identify the exact data invariant or performance problem.
2. Inspect current schema, constraints, indexes, EF Core mappings, migrations, and hot queries.
3. Classify the change: additive, compatible transformation, breaking, destructive, or data backfill.
4. Estimate lock, scan, storage, migration-duration, and application-compatibility risks.
5. Prefer expand/migrate/contract for changes that cannot be safely deployed atomically.
6. Implement schema/mapping/query changes with explicit naming and reversible migration steps where feasible.
7. Add data validation and migration tests for important invariants.
8. Inspect generated SQL for EF Core migrations and critical queries.
9. Verify execution plans or representative query behavior for performance-sensitive work.
10. Document rollout order, rollback strategy, and any approval-required step.

## Decision rules
- Additive nullable columns are generally safer than immediate destructive replacement.
- Never assume an index helps; verify workload and plan impact.
- Avoid application-side filtering when the database can filter efficiently.
- Keep transaction scope as small as correctness permits.
- Treat backfills as operational jobs with batching, idempotency, progress, and restart behavior.

## Expected outputs
- Migration/SQL and mappings
- Verification evidence
- Rollout/rollback notes
- Data-risk assessment

## Quality criteria
- Existing application version can coexist during rollout when required.
- Constraints represent real invariants.
- Queries do not introduce obvious N+1 or unbounded scans.
- Destructive steps are isolated and approval-gated.

## Verification
Build, migration validation on non-production data, affected integration tests, representative query checks, and generated SQL review.

## Stop conditions
Explicit approval is required before destructive DDL, irreversible data transformation, production execution, or removal of compatibility paths.
