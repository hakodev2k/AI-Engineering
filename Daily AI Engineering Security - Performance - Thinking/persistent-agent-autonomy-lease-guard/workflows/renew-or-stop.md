# Workflow: Observe → Lease → Checkpoint → Renew or Stop

## Trigger
Start or resume of a long-running autonomous task.

## Goal
Keep execution useful while preventing stale, drifting, or unbounded autonomous continuation.

## Inputs
Approved goal, task baseline, lease policy, current permissions, progress metrics, evidence timestamps.

## Baseline
Record goal identity, relevant workspace/system state, current evidence, zeroed action/side-effect counters, and expected progress units.

## Stages
1. **Observe:** confirm current goal and environment state.
2. **Measure baseline:** record objective progress markers.
3. **Issue lease:** create finite execution window and budgets.
4. **Execute:** pre-action hook validates lease before consequential actions.
5. **Checkpoint:** record state at configured interval.
6. **Evaluate:** compare progress, evidence freshness, and budgets.
7. **Renew?** Renew only with measurable progress; maximum 2 automatic renewals by default.
8. **Verify:** independent verifier reviews final trace.

## Responsible agent
Execution agent performs work; independent verifier performs final verification.

## Tools
Task-specific tools subject to existing permissions, `lease_guard.py`, checkpoint store, metrics collector.

## Outputs
Lease decisions, checkpoints, progress deltas, final verification status.

## Checkpoints
At lease start, configured interval, before dangerous actions, and at expiry.

## Metrics
Actions/lease, side effects/lease, checkpoint age, evidence age, progress/lease, renewals/task.

## Retry policy
At most 2 automatic renewals; implementation correction may rerun verification once.

## Stop conditions
Goal mismatch, stale evidence, missed checkpoint, exceeded action/side-effect budget, no progress, renewal limit, or missing required human approval.

## Failure path
Stop safely, persist checkpoint, revoke active lease, and escalate with evidence.

## Verification
Independent verifier recomputes decisions and confirms no child process bypassed expiry.

## Definition of Done
Task outcome verified, all consequential actions covered by valid leases, bounded renewal respected, risks documented, no blocking issue remains.
