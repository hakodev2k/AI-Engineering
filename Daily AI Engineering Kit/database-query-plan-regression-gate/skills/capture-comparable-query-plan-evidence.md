# Skill: Capture Comparable Query Plan Evidence

## Purpose
Create normalized baseline/candidate evidence that can be compared without silently mixing different queries, datasets, engines, or source revisions.

## When to use
Use before and after SQL, LINQ/EF Core, query-builder, index, statistics, provider, schema, or parameterization changes that can alter database execution behavior.

## Inputs
- Logical query identifier.
- Baseline and candidate source revisions.
- Database engine.
- Representative dataset profile.
- Original plan artifact.
- Measured duration, CPU, reads, and row counts where available.

## Preconditions
- Query can be executed safely in a non-production or approved diagnostic environment.
- Representative parameters/test data are identified.
- Production-impacting captures have explicit approval.

## Allowed tools
Read-only repository inspection, database explain/showplan collection, test execution, provided extraction scripts, log/metric readers.

## Constraints
- Never run destructive SQL.
- Never enable production-wide tracing or configuration changes without approval.
- Do not invent unavailable metrics.

## Procedure
1. Identify the exact query entry point and stable `query_id`.
2. Record repository/source revision for baseline and candidate.
3. Define a dataset profile including relevant scale and parameter distribution.
4. Capture the original baseline plan and measured metrics.
5. Normalize it with `scripts/extract-sqlserver-showplan.py`, `scripts/extract-postgres-explain.py`, or manually produce the schema-compatible JSON for another engine.
6. Run `scripts/validate-query-plan-evidence.py`.
7. Repeat with the candidate under equivalent conditions.
8. Verify engine, query ID, dataset profile, and measurement assumptions match.
9. Preserve original plans separately for reviewer inspection.

## Expected output
Two valid evidence JSON files: baseline and candidate.

## Verification
Both validation commands exit `0`, the source revisions are correct, and the evidence refers to the intended query and representative data profile.

## Failure handling
- Transient plan-capture/tool failure: retry once, preserving the first error.
- Validation failure: do not retry unchanged input; fix the evidence source.
- Environment mismatch: stop and recapture under comparable conditions.

## Stop conditions
Stop if representative evidence cannot be obtained safely, metrics are materially incomparable, or required production access/changes are not approved.
