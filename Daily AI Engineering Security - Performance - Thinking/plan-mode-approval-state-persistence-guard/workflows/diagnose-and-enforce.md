# Workflow: Diagnose and Enforce

## Trigger
Plan-mode resume/relaunch, permission-mode discrepancy, failed user-question interaction, or first attempted mutation after planning.

## Goal
Prove whether mutation is authorized and restore a fail-closed boundary when it is not.

## Inputs
Mode, session epoch, plan hash, event trace, attempted action, policy.

## Baseline
Capture whether the current host would allow the attempted mutation and whether a bound approval exists.

## Context
Use authorization facts only; hidden chain-of-thought is irrelevant.

## Stages
1. **Observe** — collect current mode, epoch, plan digest, and authorization events.
2. **Measure baseline** — record current mutation decision without changing permissions.
3. **Diagnose** — determine whether resume/relaunch, stale approval, plan drift, or missing approval caused the mismatch.
4. **Form hypothesis** — state one testable cause and expected gate result.
5. **Implement improvement** — persist/bind approval state and wire the action-time gate in the host.
6. **Measure again** — replay the original trace plus valid-control traces.
7. **Verify** — independent Verification Agent confirms results.

## Responsible agent
Authorization Reviewer diagnoses; host implementer integrates; Verification Agent verifies.

## Tools
Structured logs, stable hashing, `scripts/approval_gate.py`, unit tests.

## Outputs
Before/after authorization decisions, reason codes, implementation status, verification record.

## Checkpoints
After baseline, after diagnosis, after implementation, and before completion.

## Metrics
Unauthorized mutation block rate, valid approval acceptance, stale approval rejection, resume invariant pass rate.

## Retry policy
Maximum 2 implementation/verification retries. A retry requires changed evidence or changed implementation.

## Stop conditions
Stop immediately on ambiguous approval evidence, unexpected write, or inability to reconstruct plan identity. Escalate for human review.

## Failure path
Keep the session read-only, preserve evidence, do not widen permissions, and require explicit approval or host repair.

## Verification
Original failure trace must be blocked and valid approved trace must remain functional.

## Definition of Done
Evidence documented; baseline captured; root cause identified; gate integrated; tests pass; before/after result recorded; independent verification complete; no blocking authorization ambiguity remains.
