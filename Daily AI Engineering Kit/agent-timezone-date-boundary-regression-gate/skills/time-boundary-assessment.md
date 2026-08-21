# Time Boundary Assessment Skill

## Purpose
Detect and verify regressions caused by timezone conversion, local-clock assumptions, date truncation, DST transitions, and inclusive/exclusive boundary mistakes.

## When to use
Use for scheduling, reporting, expiry, billing windows, daily jobs, calendar logic, date filters, audit timestamps, or APIs that accept/return date/time values.

## Inputs
Target feature, relevant date/time fields, storage semantics, user/business timezone, API contracts, tests, and `config/time-policy.json`.

## Preconditions
Repository is readable and the target time-dependent flow is identifiable.

## Allowed tools
Repository read/search, bundled scanner, local tests/build, non-destructive fixtures, read-only logs.

## Constraints
Do not infer timezone intent from variable names alone. Distinguish instant, local date, local datetime, duration, and recurring civil-time concepts.

## Procedure
1. Identify each temporal value and classify its semantic type: instant, local date, local datetime, duration, or recurrence.
2. Trace where the value is created, converted, stored, serialized, compared, grouped, and displayed.
3. Identify the authoritative timezone for business rules and the canonical storage representation.
4. Run `python3 scripts/scan-time-risks.py <repo> --output scan.json`; review each finding in context.
5. Check for local server clock dependencies, unspecified `DateTime`, manual offset arithmetic, and truncation before timezone conversion.
6. Define boundary tests for day, month, and year changes plus DST transition behavior where the relevant zone observes DST.
7. Test at least UTC, `Asia/Ho_Chi_Minh`, and one DST-observing zone from policy unless repository requirements are stricter.
8. Verify round trips across storage/API serialization preserve the intended instant or local-date semantics.
9. Verify range queries use an explicit interval convention; prefer half-open `[start, end)` for instant ranges when appropriate.
10. Implement the smallest safe correction, rerun focused tests/build, and inspect the diff.
11. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
Evidence-backed findings, risk, recommendation, verification flags, and unresolved risks.

## Verification
`pass` requires multi-zone testing, boundary-case testing, and round-trip verification.

## Failure handling
Retry transient tool/test-environment failures at most twice. Preserve failing timestamps, zone IDs, commands, and outputs. Deterministic failures require diagnosis before rerun.

## Stop conditions
Stop before approval-required schema/config/data-rewrite/deployment actions, after two repeated transient failures, or when timezone/business semantics cannot be established from available evidence.
