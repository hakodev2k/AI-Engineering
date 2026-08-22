# Collect Migration Evidence

## Purpose
Build the smallest sufficient evidence set before judging a migration.

## Inputs
Change request, repository root, migration range/name, target DB/ORM if known.

## Preconditions
Repository is readable and the requested migration can be identified. Database write credentials are neither required nor allowed.

## Allowed tools
Read/search repository files; Git diff/history; build tooling; ORM commands that only generate scripts; local shell commands that do not mutate a database.

## Constraints
Never apply a migration. Never request broader permissions to obtain evidence.

## Procedure
1. Inspect repository structure and locate migration/configuration projects.
2. Identify the exact changed migration files and their Git diff.
3. Find model/schema changes and nearby migration conventions.
4. Identify DB engine, ORM version, and migration source/target versions from repository evidence.
5. Locate migration tests, deployment scripts, rollback guidance, and production safeguards.
6. Generate SQL using a non-applying command when supported; otherwise use the checked-in SQL artifact.
7. Record facts with file/command evidence; record unresolved assumptions as hypotheses.
8. Hand the SQL path and evidence summary to the risk analyst.

## Output
Migration identity, affected objects, generated SQL path, facts/evidence, hypotheses, tests, and open questions.

## Verification
Generated SQL must correspond to the requested migration range and no database-mutating command may appear in the command log.

## Failure handling
Retry a transient read/tool failure at most twice. Stop immediately on permission failure, ambiguous migration range, or inability to prove that SQL generation is non-applying.
