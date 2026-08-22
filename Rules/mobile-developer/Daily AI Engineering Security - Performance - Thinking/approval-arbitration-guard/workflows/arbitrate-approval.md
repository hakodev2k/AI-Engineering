# Workflow — Arbitrate Approval

## Trigger
A privileged request enters an approval boundary.

## Goal
Route approval to the intended reviewer without indefinite hook blocking, duplicate decisions, or unsafe fallback.

## Inputs
Request metadata, risk class, effective reviewer, policy, external approver health.

## Baseline
Record current approval latency, timeout rate, duplicate prompt count, and routing mismatches before rollout.

## Stages
1. **Observe:** capture request ID, action, risk and runtime reviewer evidence.
2. **Diagnose:** determine whether native, external, auto-review, or human-security review owns the request.
3. **Propose:** choose `observe`, `defer`, or bounded `claim`.
4. **Validate:** run the deterministic transition checker.
5. **Dispatch:** show/notify only the approved surfaces.
6. **Resolve:** accept the first policy-valid terminal decision; cancel competitors.
7. **Verify:** independent verifier checks terminal uniqueness, lease behavior and audit record.

## Checkpoints
Before claim, before terminal decision, after cancellation.

## Metrics
p50/p95 approval latency, expired claims, rejected late decisions, native lockout time, routing mismatch count.

## Retry policy
At most one retry for transient state-read or cancellation failure. Never repeat an unchanged approval decision indefinitely.

## Failure path
If reviewer identity/policy cannot be resolved, release external claim and defer/fail closed to the configured native/human path.

## Stop conditions
Terminal decision recorded; lease expires; policy violation; cancellation failure after one retry.

## Definition of Done
Exactly one terminal decision exists, fallback remained reachable until resolution, required human/security review was preserved, and verifier reports no blocking issue.
