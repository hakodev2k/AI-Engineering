# Rollout Verification Skill

## Purpose
Independently verify that a rollout stage is safe to continue, hold, or roll back using recorded telemetry and the approved rollout plan.

## Inputs
Validated rollout plan, current stage, approval evidence, telemetry window, incident/error evidence, and flag state readback.

## Preconditions
The verifier is not the sole author/implementer of the change. Telemetry is readable without production mutation privileges.

## Process
1. Confirm the exact plan artifact and flag key match the current rollout.
2. Re-run the deterministic rollout validator.
3. Read the actual flag state from the provider and compare it with the planned stage.
4. Check that the minimum stage observation duration has elapsed.
5. Query each required metric for the same time window and target cohort.
6. Compare observed values with the plan's abort thresholds and success criteria.
7. Check for correlated incidents, support reports, queue/backlog growth, data-quality regressions, and fallback failures relevant to the feature.
8. Return one decision: `continue`, `hold`, `rollback`, or `inconclusive`.
9. For `continue` into production or 100%, verify required approval exists before any state change.
10. Preserve evidence without exposing secrets or unnecessary user data.

## Expected output
Decision, stage, observation window, metric evidence, threshold comparison, flag-state evidence, approval status, confidence, and unresolved risks.

## Verification
A continuation decision is valid only when all mandatory metrics satisfy thresholds, stage duration is complete, actual flag state matches the plan, and required approvals exist.

## Failure handling
Telemetry outage produces `inconclusive`, not `continue`. A metric breach produces `rollback` or `hold` according to the approved plan. Tool/transient read failures may be retried once. Conflicting evidence stops progression and escalates.

## Stop conditions
Missing telemetry, stale plan, mismatched flag state, unmet stage duration, threshold breach, missing approval, or inability to identify the active cohort.
