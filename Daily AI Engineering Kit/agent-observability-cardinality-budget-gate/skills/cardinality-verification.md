# Cardinality Verification Skill

## Purpose
Independently prove that a telemetry-cardinality change is correct, bounded, safe, and supported by evidence.

## Inputs
Changed files/diff, investigation evidence, scanner output, optional sample-analysis output, host test/build output, evidence JSON.

## Preconditions
The verifier is not the sole implementing agent for confirmed high-risk changes.

## Allowed tools
Read repository/diff, rerun deterministic scripts, focused tests/build, and inspect non-secret evidence artifacts.

## Constraints
Do not silently repair implementation while verifying. Return deficiencies to the Implementation Agent. Missing evidence cannot be treated as success.

## Process
1. Reconstruct the affected telemetry producer independently.
2. Verify each changed dimension's source and expected domain.
3. Confirm no dynamic metric names or unbounded label/attribute values remain.
4. Rerun `scripts/scan-cardinality.py`.
5. Rerun `scripts/analyze-sample.py` when a representative sample exists.
6. Rerun focused tests and applicable host checks.
7. Inspect diff for unrelated changes, sensitive telemetry, or weakened controls.
8. Verify intentional exceptions and required approvals.
9. Validate evidence with `scripts/verify-evidence.py`.
10. Set status to `verified`, `blocked`, or `failed`.

## Expected output
Independent decision with reproduced commands, evidence, rejected claims if any, remaining risks, and next action.

## Verification criteria
`verified` requires applicable tests/build to pass, no unexplained blocking findings, sample thresholds to pass or have approved exceptions, changed dimensions to be demonstrably bounded, valid evidence, and no pending approval-required action.

## Failure handling
Return retryable defects to implementation within the total two-retry workflow budget. Retry a clearly transient tool failure once. Missing decisive evidence yields `blocked`.

## Stop conditions
Conclusive decision, exhausted retries, approval boundary, or unrecoverable environment/permission failure.
