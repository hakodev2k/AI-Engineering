# Skill: Investigate Cursor Instability

## Purpose
Identify why cursor pagination duplicates, omits, reorders, or cycles records.

## When to use
Use for skipped/duplicated records, infinite pagination, inconsistent counts, or changes to cursor/order logic.

## Inputs
Endpoint/query entry point, cursor codec, ordering, filters, traces, tests, and optional complete expected ID set.

## Preconditions
A reproducible endpoint or captured trace exists.

## Required context
Read endpoint, query/repository, cursor codec, ordering fields, and pagination tests. Expand to indexes/ORM translation only when evidence requires it.

## Allowed tools
Repository read/search, tests, local API calls, read-only database/query-plan inspection, deterministic gate.

## Constraints
No production writes, tenant-filter weakening, permission escalation, or breaking cursor changes without approval.

## Process
1. Record filter, sort direction, page size, and initial cursor.
2. Identify every ordered field and whether the tuple is globally unique.
3. Trace cursor encode/decode and confirm all ordered fields are preserved.
4. Capture pages through terminal cursor.
5. Convert capture to the trace schema.
6. Run the deterministic gate.
7. For duplicates, inspect inclusive/exclusive boundaries and tie-breakers.
8. For omissions, compare against an independently gathered expected ID set when available.
9. For cycles, verify the next cursor advances.
10. For reordering, compare ORDER BY with cursor comparison semantics.
11. Validate one hypothesis at a time with repository/query evidence.
12. Hand off only confirmed or bounded findings.

## Expected output
Findings with symptom, evidence, confidence, affected component, violated invariant, and recommended validation.

## Verification
A finding is confirmed only when trace and implementation evidence agree or a targeted test reproduces it.

## Failure handling
Transient tool/API failures may be retried twice with evidence preserved. Non-reproducible behavior remains unresolved.

## Stop conditions
Stop before production writes, destructive SQL, security weakening, breaking API/cursor changes, or privilege escalation.
