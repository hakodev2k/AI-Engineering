# Query Shape Investigation Skill

## Purpose
Identify whether an EF Core change introduces query-shape regressions such as unnecessary materialization, oversized Include graphs, client-side filtering, repeated persistence in loops, or synchronous query execution in async flows.

## When to use
Use during feature implementation, code review, performance investigation, PR preparation, or after a latency/database-load regression involving EF Core.

## Inputs
Repository root, changed C# files, affected endpoints/jobs, EF Core version, known performance symptoms, and acceptance criteria.

## Preconditions
Relevant solution/project files are accessible; generated code and migrations are excluded unless intentionally investigated.

## Allowed tools
Repository search/read, `dotnet test`, `dotnet build`, EF Core logging/query inspection, database execution plans with safe read-only access, and `scripts/scan_ef_queries.py`.

## Constraints
- Treat static findings as hypotheses, not proof.
- Do not change query semantics solely to silence a warning.
- Do not remove tenant/security filters.
- Do not add production indexes or schema changes without approval.

## Procedure
1. Locate changed repositories/services and DbContext usage.
2. Trace the request/job path to the affected LINQ query.
3. Read adjacent mappings, navigation properties, query filters, and tests.
4. Run `python scripts/scan_ef_queries.py --root <repo> --policy <kit>/config/policy.yaml --output ef-query-scan.json`.
5. Classify each finding as confirmed, false positive, or requires runtime evidence.
6. For confirmed risks, capture generated SQL with safe logging or `ToQueryString()` in a non-production diagnostic path.
7. Measure row shape, joins, round trips, and materialized entity count where possible.
8. Form one remediation hypothesis at a time.
9. Hand confirmed findings to the remediation skill.

## Expected output
Affected component, finding code, repository evidence, generated-SQL evidence when available, confidence, impact, and recommended next action.

## Verification
Every confirmed finding has concrete code or runtime evidence. False positives are documented rather than silently ignored.

## Failure handling
If runtime evidence is unavailable, keep the result `inconclusive`. Retry a transient build/test/log collection failure once. Permission failures stop the workflow; never broaden DB access automatically.

## Stop conditions
Unknown query entry point, missing required repository context, security-filter ambiguity, or inability to distinguish expected query complexity from regression risk.
