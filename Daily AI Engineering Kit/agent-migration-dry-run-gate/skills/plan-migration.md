# Skill: Plan Migration

## Purpose
Turn a proposed database migration into an evidence-backed execution plan before any database-changing command is allowed.

## When to use
Use when a change adds, removes, renames, transforms, indexes, backfills, or otherwise modifies persistent database state.

## Inputs
- Repository root.
- Migration files or generated migration diff.
- Database engine and version when known.
- Application deployment order.
- Optional schema snapshot, row counts, query plans, and maintenance-window constraints.

## Preconditions
- Repository is readable.
- Target environment is identified as non-production for automated execution.
- Relevant migration files can be enumerated.

## Allowed tools
Repository search/read, Git diff, build/test tools, database client against non-production targets, and `scripts/analyze-migration.py`.

## Constraints
Follow `rules/migration-safety.md`. Never execute production migration commands without approval.

## Procedure
1. Locate migration entry points and migration configuration.
2. Identify changed schema objects and data operations.
3. Run `python scripts/analyze-migration.py <migration-files...>` and preserve its JSON output.
4. Classify each operation as additive, data-changing, potentially locking, destructive, or irreversible.
5. Trace application code that depends on affected columns, tables, indexes, constraints, or data shape.
6. Identify backward/forward compatibility requirements for rolling deployments.
7. Define prechecks: backup availability, free space, connection target, schema version, row counts, and required permissions.
8. Define the dry-run command for an isolated/non-production database.
9. Define rollback or roll-forward recovery. If neither is credible, mark the plan blocked.
10. Define post-migration verification queries/tests and acceptance criteria.
11. Populate `templates/migration-plan.yaml` without removing required fields.
12. Mark `needs-approval` for any approval-required operation; otherwise mark `planned`.

## Expected output
A complete migration-plan YAML plus analyzer evidence.

## Verification
Every affected object is represented; every risky operation has mitigation; dry-run, rollback, and verification commands are concrete; target environment is explicit.

## Failure handling
Tool/environment failures may be retried at most twice. Validation failures require plan correction rather than blind retry. Permission failures stop execution.

## Stop conditions
Stop on unknown production target, missing rollback/backup plan where required, destructive SQL, unresolved compatibility break, or missing approval.
