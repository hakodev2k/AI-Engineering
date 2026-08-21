# Skill: Simulation Evidence Review

## Purpose
Determine whether a side-effecting operation has been sufficiently exercised in a non-live environment and whether live execution can be considered for approval.

## Inputs
- Side-effect plan.
- Simulation record.
- Expected effect assertions.
- Provider/tool capability evidence.
- Reviewer identity.
- Approval evidence when required.

## Preconditions
The simulation record must reference the same action ID and plan revision being reviewed.

## Procedure
1. Verify simulation mode is one of the policy-supported modes.
2. Verify the simulation target is not the live production target unless the provider explicitly guarantees validate-only semantics and no side effect occurred.
3. Compare expected versus observed requests, targets, recipients, resource identifiers, payload shape, count/volume, and permission scope.
4. Confirm no unplanned external effect was observed.
5. Confirm live-only fields and destinations are explicitly identified.
6. Confirm the simulation record was produced after the current plan revision.
7. Confirm high-risk actions have independent reviewer evidence.
8. Return one status: `verified-for-approval`, `needs-resimulation`, `blocked`, or `human-approval-required`.

## Verification criteria
- No target drift.
- No recipient/audience drift.
- No payload mutation outside the plan.
- No missing expected assertion.
- No unsupported assumption about provider dry-run semantics.
- Reviewer is different from the executor for high-risk actions.

## Failure handling
A failed or incomplete simulation is evidence, not permission to bypass simulation. Allow at most one retry for transient environment/tool failures. Validation failures require plan correction before rerun.

## Stop conditions
Stop on unexpected side effects, production target mismatch, missing simulation evidence, stale plan revision, or absent approval for a live action that policy marks approval-required.
