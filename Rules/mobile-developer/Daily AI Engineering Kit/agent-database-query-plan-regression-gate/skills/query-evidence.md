# Skill: Query Evidence Collection

## Purpose
Build comparable evidence before and after a database-affecting code change.

## When to use
When a task changes EF Core/LINQ, raw SQL, filtering, joins, ordering, pagination, projection, Includes, or database access patterns.

## Inputs
Task acceptance criteria, repository, relevant test data, database engine, approved diagnostic environment.

## Preconditions
Repository is readable; database diagnostics are authorized; production is not modified.

## Required context
Entry point, query construction, generated SQL, nearby tests, schema/index definitions, representative parameters.

## Allowed tools
Repository search, build/test tools, EF Core `ToQueryString`, SQL Server estimated/actual plans when authorized, PostgreSQL EXPLAIN, read-only database metadata.

## Constraints
Never run destructive SQL. `EXPLAIN ANALYZE` against production requires explicit approval because it executes the query.

## Procedure
1. Locate the API/job/handler that triggers the query.
2. Trace query construction to the database call.
3. Record generated SQL and representative parameters without secrets/PII.
4. Identify tests and expected cardinality/ordering semantics.
5. Record relevant indexes/schema from source-controlled migrations or read-only metadata.
6. Capture baseline plan in a stable environment.
7. Record engine/version, dataset identity, parameter class, and capture method.
8. Make no performance claim unless candidate evidence uses comparable conditions.
9. After implementation, capture candidate plan using the same method.
10. Run `scripts/query_plan_gate.py` and preserve its JSON report.

## Expected output
Baseline plan, candidate plan, generated SQL reference, environment facts, analyzer report.

## Verification
Evidence is valid only when engine, query semantics, representative parameters, and dataset/environment are comparable.

## Failure handling
If plan capture fails transiently, retry at most twice. If permission or environment differs, stop rather than fabricate a comparison.

## Stop conditions
Missing authorization, non-comparable plans, sensitive data that cannot be safely redacted, or production-only reproduction without approval.