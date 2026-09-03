# Skill: Approval State Audit

## Purpose
Determine whether a write-capable action is backed by explicit, current user approval rather than inferred runtime state.

## Trigger
Before enabling writes from a planning session, after resume/relaunch/reconnect, after a failed user-question interaction, or when the plan changes.

## Inputs
Current permission mode, session epoch, plan hash, ordered authorization events, attempted action, and optional persisted approval record.

## Preconditions
The caller can identify the current session epoch and compute a stable digest for the plan that the user reviewed.

## Required context
Only authorization-relevant events are required. Model chain-of-thought is neither required nor permitted.

## Allowed tools
Read-only state inspection, hashing, structured log inspection, and `scripts/approval_gate.py`.

## Constraints
- Approval MUST be explicit and accepted.
- Approval MUST bind the current `plan_hash` and `session_epoch`.
- Resume/relaunch notices MUST NOT count as approval.
- A plan change MUST invalidate earlier approval.
- Unknown or missing authorization state MUST fail closed.

## Procedure
1. Capture the current permission mode and session epoch.
2. Compute the canonical plan hash.
3. Locate the latest explicit approval event.
4. Verify accepted state, plan hash, session epoch, and non-empty approval ID.
5. Replay later events to detect plan changes or resume transitions.
6. For a mutating action, run the deterministic gate.
7. Record allow/deny, reason code, approval ID, and evidence source.
8. If denied, keep or restore the restrictive mode and request fresh approval through the host's normal mechanism.

## Decision points
- Missing approval: deny mutation.
- Approval for different plan/epoch: deny mutation.
- Resume reports a widened mode before approval: flag `unapproved_plan_mode_drop` and deny.
- Current valid approval: mutation may proceed subject to all other security policies.

## Expected output
A structured authorization decision with evidence that can be reviewed independently.

## Metrics
Unauthorized attempts blocked, valid approvals accepted, stale approvals rejected, resume invariant coverage.

## Verification
Run unit tests and at least one captured/synthetic resume trace. The reviewer must confirm that no notice/tool error is treated as consent.

## Failure handling
On malformed state or missing evidence, return deny. Do not recover by switching to a broader permission mode.

## Stop conditions
Stop after a deterministic decision is available, or after one evidence-reload retry if the authorization log was temporarily unavailable.
