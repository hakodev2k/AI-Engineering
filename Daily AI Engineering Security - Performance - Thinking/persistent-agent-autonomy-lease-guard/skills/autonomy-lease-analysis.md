# Skill: Autonomy Lease Analysis

## Purpose
Convert open-ended persistent work into bounded execution segments that require evidence-backed renewal.

## Trigger
Any agent expected to continue autonomously beyond a short interactive turn, especially with consequential tools.

## Inputs
User goal, goal hash, allowed actions, tool permissions, side-effect definition, checkpoint cadence, evidence freshness requirements, task metrics.

## Preconditions
Existing tool/security permissions are defined. Lease controls may only reduce authority, never expand it.

## Required context
Current task goal, latest checkpoint, verified evidence, and externally observable progress indicators.

## Allowed tools
Read-only telemetry, checkpoint state, deterministic lease validator, approved task tools.

## Constraints
MUST NOT request hidden chain-of-thought. MUST NOT infer progress from activity volume alone. MUST NOT renew a lease solely because the agent says it is progressing.

## Procedure
1. Hash or otherwise deterministically identify the approved goal.
2. Define measurable progress units and consequential side effects.
3. Establish baseline task state and evidence timestamp.
4. Issue a finite lease with action, side-effect, time, checkpoint, and evidence limits.
5. Before consequential actions, run the lease guard.
6. At expiry, compare observable state against the prior checkpoint.
7. Renew only when progress delta meets threshold, evidence is fresh, and renewal count is within policy.
8. Require independent/human review when renewal limit is reached or goals change.

## Decision points
Goal mismatch, stale evidence, missed checkpoint, exhausted budget, or no progress => stop.

## Expected output
Facts, assumptions, evidence, goal identity, progress delta, risks, lease decision, verification status.

## Metrics
Renewals, side effects, actions, stale-evidence blocks, no-progress stops, rework after completion.

## Verification
Independent verifier samples traces and reproduces lease decisions from recorded state.

## Failure handling
Persist a safe checkpoint, revoke lease, preserve existing permission boundaries, and escalate ambiguity.

## Stop conditions
Maximum 2 automatic renewals by default; never infinite renewal.
