# Skill: Collect EF Core Query Evidence

## Purpose
Build a reproducible evidence bundle before optimization work begins.

## When to use
Use for an EF Core query that became slower, times out, allocates excessively, returns too much data, or changed SQL/plan behavior after a code, model, provider, or database change.

## Inputs
- Repository path and target project.
- Entry point or slow operation.
- Known baseline, if available.
- Database provider and environment constraints.

## Preconditions
- Read-only investigation is permitted.
- Any production access is least-privilege and read-only.

## Allowed tools
Repository search, build/test commands, EF Core logging, `ToQueryString()`, database read-only plan inspection, git history/diff, profiler traces supplied by the operator.

## Constraints
Follow `rules/query-investigation-rules.md`. Never execute write SQL as part of evidence collection.

## Procedure
1. Locate the application entry point, service/repository method, DbContext, entity configuration, and nearby tests.
2. Record the exact LINQ expression and important input shapes: cardinality, page size, filters, date ranges, tenant, sort order.
3. Record EF Core version, provider version, target framework, provider, and relevant DbContext options.
4. Capture generated SQL with parameter values redacted when sensitive; preserve parameter types and shapes.
5. Record tracking behavior, `Include` graph, projection, split/single query mode, pagination strategy, and any client-side materialization boundaries.
6. Reproduce the symptom using the narrowest representative test or benchmark.
7. Capture elapsed time, returned row count, database execution time when available, and allocation/query-count signals when relevant.
8. Obtain a read-only estimated/actual execution plan where permitted. Record scans/seeks, joins, sorts, spills, key lookups, cardinality mismatches, and expensive operators.
9. Compare current evidence with the known-good commit/version if available.
10. Write findings using the investigation contract in `schemas/investigation.schema.json`.

## Expected output
A fact-based investigation artifact containing reproduction steps, generated SQL, performance measurements, plan findings, and bounded hypotheses.

## Verification
Evidence must identify source locations and enough workload detail for another engineer to reproduce the observation.

## Failure handling
- Transient database/tool failure: retry at most twice and preserve both failure outputs.
- Permission failure: stop; do not request broader permissions automatically.
- Non-reproducible symptom: report what differed and mark root cause unverified.

## Stop conditions
Stop when evidence is sufficient to rank hypotheses, or when reproduction/permissions make reliable investigation impossible.
