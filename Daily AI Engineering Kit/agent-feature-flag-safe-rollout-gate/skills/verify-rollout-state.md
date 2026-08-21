# Skill: Verify Rollout State

## Purpose
Independently verify that a feature flag rollout step is healthy before it is expanded or declared complete.

## Inputs
- Flag contract
- Current rollout state
- Telemetry snapshot
- Acceptance criteria
- Previous known-good state

## Process
1. Confirm the observed provider/config state matches the declared current state.
2. Confirm exposure percentage and targeting are no broader than approved.
3. Confirm kill switch remains available.
4. Evaluate every success condition against current telemetry.
5. Evaluate every rollback condition even when success metrics pass.
6. Check error rate, latency, dependency health, saturation, and business correctness when relevant.
7. Verify no unintended flag/config changes occurred.
8. If thresholds fail, recommend rollback to the preserved previous state and stop expansion.
9. If evidence is incomplete, return `verification_incomplete`; do not infer success.
10. If all checks pass, return `verified` with evidence references and the maximum safe next rollout step.

## Failure handling
Transient telemetry/tool failures may be retried twice. Missing telemetry, permission failures, or inconsistent sources stop verification.

## Completion criteria
Verification is complete only when current state, scope, success conditions, rollback conditions, and unintended-change checks all have explicit evidence.
