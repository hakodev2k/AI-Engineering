# Skill: Investigate Schema Drift

## Purpose
Determine exactly why a proposed repository change alters database schema and separate intended change from accidental drift.

## When to use
Use after persistence-model, mapping, migration, provider, convention, or ORM-version changes produce a schema delta.

## Inputs
Baseline snapshot, candidate snapshot, requested change/acceptance criteria, repository diff, migration files, generated SQL when available.

## Preconditions
Work from a clean or understood Git state. Identify the database provider and migration mechanism. Never point investigation commands at production.

## Allowed tools
Repository search/read, Git diff, ORM migration inspection, local/test database schema inspection, read-only database metadata, build/test commands, `scripts/schema_drift.py`.

## Constraints
Do not mutate production, delete migrations, regenerate history, or mark destructive drift as accepted. Do not infer a rename solely because one object disappeared and another appeared.

## Procedure
1. Record requested schema intent in concrete terms: object, old shape, new shape, reason.
2. Locate persistence entry points: models/entities, mappings, migration configuration, schema scripts, provider configuration.
3. Identify nearby migration history and tests.
4. Produce or obtain baseline and candidate snapshots.
5. Run `schema_drift.py` and preserve its JSON report.
6. For each finding, trace it to a repository diff or tool/provider behavior.
7. Classify each finding as `intended`, `unintended`, or `unresolved` with file/command evidence.
8. Treat drops, narrowing type changes, nullable-to-required changes, primary-key changes, and unresolved renames as destructive/high-risk.
9. Form one hypothesis per unexplained drift and validate it independently by reverting/isolation, generated SQL, metadata, or a focused test.
10. Recommend the smallest safe correction. Do not broaden the migration to clean unrelated schema.
11. Re-capture candidate schema and re-run the gate after any fix.
12. Stop when all findings are explained and policy allows progression, or when approval/escalation is required.

## Expected output
A schema-drift report plus evidence mapping each finding to cause, intent, risk, recommended action, and verification status.

## Verification
The same inputs must reproduce the same normalized diff. Each claimed cause must cite repository or generated-schema evidence.

## Failure handling
Invalid snapshot: stop. Export tool transient failure: retry at most twice. Permission failure: stop. Unexplained destructive drift: escalate for human review.

## Stop conditions
Stop before destructive execution, production migration, irreversible change, or when evidence cannot distinguish intended from accidental drift.
