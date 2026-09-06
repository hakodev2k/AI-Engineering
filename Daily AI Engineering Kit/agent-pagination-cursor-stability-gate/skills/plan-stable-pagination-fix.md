# Skill: Plan a Stable Cursor Fix

## Purpose
Produce the smallest compatibility-preserving fix for an evidenced cursor-pagination invariant violation.

## Inputs
Confirmed findings, endpoint contract, cursor format, ordering, tests, compatibility constraints.

## Preconditions
At least one failure is reproducible.

## Process
1. State the violated invariant.
2. Check whether ordering lacks a unique tie-breaker.
3. Verify cursor serialization contains every ordering component.
4. Verify comparison operators match sort direction and null semantics.
5. Assess compatibility for already-issued cursors.
6. Select the smallest repair and exact files.
7. Add a regression fixture that fails before the change.
8. Cover equal primary sort keys, empty page, final page, and supported page-size changes.
9. Run relevant tests and the deterministic gate.
10. Inspect the diff for unrelated behavior.
11. Record residual risk and approvals.

## Constraints
Do not silently invalidate existing cursors. Breaking cursor/API changes require approval.

## Expected output
A bounded implementation plan with files, tests, compatibility strategy, and approval points.

## Verification
Each edit must map to evidence and have a measurable check.

## Failure handling
If compatibility cannot be preserved, stop as blocked and require human approval.

## Stop conditions
Stop for destructive data/schema work, production config, security weakening, or breaking contracts without approval.
