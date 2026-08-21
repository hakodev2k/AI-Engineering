# Hotfix Verification

## Purpose
Prove that the incident fix changes only the intended behavior and remains rollback-safe.

## Inputs
- Valid hotfix plan
- Final diff
- Build/test outputs
- Runtime or staging evidence when available
- Rollback evidence

## Preconditions
Implementation is complete but not yet declared verified.

## Procedure
1. Generate the changed-file manifest with `scripts/inspect-hotfix-diff.py`.
2. Confirm every changed file is allowed by the plan.
3. Confirm no protected path or forbidden category was touched.
4. Run the targeted verification commands from the plan.
5. Run at least one negative-control test covering adjacent unaffected behavior.
6. Confirm the expected behavior changed as planned and no declared invariant regressed.
7. Confirm rollback instructions are executable and reference the exact deployment/change unit.
8. Confirm temporary exceptions have owner, expiry, and follow-up action.
9. Record reviewer identity distinct from implementer for severity `sev0` or `sev1`.
10. Run `scripts/evaluate-containment-gate.py`.

## Expected output
A containment report with status `verified`, `human-approval-required`, or `blocked`.

## Failure handling
A failed test, unexplained diff, missing rollback, expired exception, or reviewer-independence failure blocks verification. One retry is allowed only for transient infrastructure/tool failure; preserve the first failure evidence.

## Stop conditions
Stop when a semantic or regression failure is observed. Do not repeatedly rerun until a passing result appears.