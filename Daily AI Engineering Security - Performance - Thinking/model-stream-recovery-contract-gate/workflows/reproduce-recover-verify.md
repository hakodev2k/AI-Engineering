# Workflow: Reproduce → Recover → Verify

## Trigger
Stream-handling regression, unexplained interruption, stalled unattended session, hook recovery failure or cancellation-label anomaly.

## Goal
Correct terminal-state attribution and restore bounded recovery without unsafe replay.

## Inputs
Runtime version, failing trace, canary fault, retry budget and side-effect policy.

## Baseline
Capture a failing trace before code/config changes and validate it to record exact contract violations.

## Context
Record parent/subagent role, provider/model, hook configuration, watchdog/timeout policy and explicit user signals.

## Stages
1. Observe and preserve original trace.
2. Determine facts and causal event.
3. Reproduce with a deterministic or controlled canary.
4. Form one state-machine hypothesis.
5. Implement one transition/dispatch change.
6. Replay the canary.
7. Validate normalized trace.
8. Independent verification.

## Responsible agent
Runtime implementer through stage 6; Recovery Verifier for stages 7–8.

## Tools
Runtime logs, canary harness, package validator and tests.

## Outputs
Before/after trace, hypothesis, change record, validator report and verification status.

## Checkpoints
Explicit human cancel blocks recovery. Side-effect uncertainty blocks automatic retry. Unknown cause cannot be relabeled as user action.

## Metrics
False-user-cancel count, hook coverage, retry count, final-event count and successful recovery rate.

## Retry policy
At most two runtime recovery retries per turn and at most three remediation hypotheses per engineering run.

## Stop conditions
Verified contract; explicit user cancel; unsafe replay risk; retry budget exhausted; or three unsuccessful hypotheses.

## Failure path
Preserve evidence and escalate with causal event, terminal label, hook state and retry history.

## Verification
Validator plus independent inspection of a live/fixture canary.

## Definition of Done
Baseline captured, cause evidenced, fix implemented, after trace captured, retries bounded, tests pass and independent verification complete.
