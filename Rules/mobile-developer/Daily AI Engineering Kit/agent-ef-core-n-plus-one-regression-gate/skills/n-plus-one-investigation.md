# EF Core N+1 Investigation Skill

## Purpose
Detect, reproduce, and safely remove EF Core query multiplication where one logical request triggers one base query plus repeated per-row queries.

## When to use
Use for slow endpoints/jobs, EF Core query regressions, lazy-loading code, loop-based repository calls, or PRs that change navigation loading/projections.

## Inputs
Target endpoint/job, relevant LINQ/repository code, entity relationships, representative test data size, current tests, and query logs/metrics when available.

## Preconditions
The target flow is identifiable and can be exercised in a non-production environment. Query logging or interception can be enabled without exposing sensitive parameter values.

## Allowed tools
Repository read/search, `scripts/scan-n-plus-one.py`, unit/integration tests, EF Core logging/interceptors, build/static analysis, SQL/query-plan inspection when read-only.

## Constraints
Scanner hits are hypotheses. A large query count is not automatically N+1; prove query count scales with collection size. Do not fix performance by changing business results.

## Procedure
1. Identify the request/job entry point and the exact result contract.
2. Trace all EF Core query creation and materialization points in the flow.
3. Run `python3 scripts/scan-n-plus-one.py <repo> --output scan.json` and inspect each hit in context.
4. Establish a baseline using representative input sizes such as N=1 and N=10. Record SQL/query count for the same logical operation.
5. Determine whether query count grows approximately with N. Separate intentional batched queries from repeated per-item queries.
6. Check lazy-loading proxies, virtual navigations, loop-contained `Find/First/Any/Count/ToList`, premature `ToList/AsEnumerable`, and repository abstractions that hide queries.
7. Form one hypothesis at a time and identify the minimal change: projection, explicit join, filtered include, prefetch into a dictionary/set, batch query, or disabling lazy loading for the path.
8. Preserve semantics: ordering, filters, authorization scope, pagination, null behavior, tracking behavior, and cardinality.
9. Implement the smallest safe change. Do not add broad `Include` trees without evidence because cartesian explosion can replace N+1 with another regression.
10. Re-run focused tests and the representative query-count scenario. Record before/after query count and verify returned data equivalence.
11. Inspect generated SQL when the replacement query is materially more complex; check for accidental client evaluation or oversized joins.
12. Inspect the diff for unrelated changes.
13. Produce an assessment matching `schemas/assessment.schema.json`, then run `python3 scripts/validate-assessment.py assessment.json`.

## Expected output
An evidence-backed assessment with findings, baseline/changed query counts, semantic equivalence status, verification status, and unresolved risks.

## Verification
A pass requires result equivalence, focused tests, measured query counts, and diff review. The changed query count must not exceed baseline for the tested representative scenario.

## Failure handling
Retry transient test/database infrastructure failures at most twice. Preserve logs, test input size, and query count. Do not rerun deterministic failures without changing code/configuration or the hypothesis.

## Stop conditions
Stop before schema/production/breaking changes without approval; when representative reproduction is impossible; after two transient infrastructure failures; or when a proposed optimization changes the API/business result contract.
