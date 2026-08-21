# Skill: Verify a Feature-Flag Rollout

## Purpose
Prove that a rollout stage is safe to hold, expand, or roll back.

## Inputs
Validated rollout contract, current exposure, baseline evidence, current telemetry, test results.

## Preconditions
The rollout contract is schema-valid and required approval is present for production actions.

## Process
1. Confirm the current flag state and cohort match the contract.
2. Re-run deterministic tests for flag-off and flag-on paths.
3. Compare current guardrail metrics with baseline and contract thresholds.
4. Check correctness signals and user/business invariants.
5. Inspect errors/logs introduced since the stage began.
6. Classify result as `pass`, `fail`, or `inconclusive`.
7. On `fail`, recommend rollback and preserve evidence.
8. On `inconclusive`, block expansion and identify missing signal.
9. On `pass`, permit only the next contract-defined stage; production expansion still requires approval where policy says so.

## Expected output
Verification record containing stage, exposure, evidence, guardrail comparisons, result, risk, and next action.

## Verification
The result is valid only when every required guardrail has a current evidence reference and no blocking test failed.

## Failure handling
Transient telemetry/tool errors may be retried twice. Repeated failure results in `inconclusive`, never implicit success.

## Stop conditions
Stop immediately on a breached rollback threshold, unknown production state, missing approval, or mismatch between actual and declared cohort.
