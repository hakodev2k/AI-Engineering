# Skill: Investigate Pagination Consistency

## Purpose
Prove whether a paginated endpoint can skip, duplicate, loop, expose unbounded work, or accept malformed cursors.

## When to use
Use for new/changed list APIs, bug reports involving missing/duplicate rows, performance incidents, or PRs changing ordering/filtering/cursor logic.

## Inputs
Endpoint/query entry point, request contract, query implementation, entity/index definitions, tests, and representative ordering data.

## Preconditions and context
Repository is readable; identify controller/handler, cursor codec, query builder, storage ordering and tests. Read nearby code before expanding scope.

## Allowed tools
Repository search/read, local build/test, static scanner, non-destructive local/test database queries.

## Constraints
Do not alter public contracts, schema, production configuration or data without approval. Treat scanner output as leads, not facts.

## Procedure
1. Trace request from endpoint to query execution and response cursor creation.
2. Record filters, sort direction, every ORDER BY key, uniqueness and mutability.
3. Prove a total order exists. If the primary sort is non-unique, require a unique tie-breaker in both query predicate and cursor.
4. Trace cursor encode/decode and validate malformed, missing, stale/version-mismatched values.
5. Verify page-size bounds before query execution.
6. Model rows sharing sort values and simulate page boundaries.
7. Model insert/delete between requests; determine promised consistency semantics.
8. Check forward progress and termination for empty/final pages.
9. Locate/add tests that reproduce confirmed failure before changing implementation when practical.
10. Implement the smallest safe correction, run focused tests, then broader build/tests.
11. Inspect diff and record facts, hypotheses, evidence, remaining risk and verification status.

## Expected output
Structured findings matching `schemas/finding.schema.json`, plus test/build evidence.

## Verification
No duplicate/omitted rows in fixture scenarios; cursor advances; invalid cursor fails safely; page size is bounded; relevant tests/build pass.

## Failure handling
Transient tool failure: retry at most twice while preserving logs. Build/test failure: do not retry unchanged; diagnose once, fix if in scope, rerun. Permission/environment failure: stop and report evidence.

## Stop conditions
Stop on required human approval, missing essential context, two repeated tool failures, or inability to establish safe semantics.
