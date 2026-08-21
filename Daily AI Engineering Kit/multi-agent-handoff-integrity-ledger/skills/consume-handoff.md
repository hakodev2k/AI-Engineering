# Skill: Consume a Handoff

## Purpose
Safely accept or reject an incoming handoff before beginning the next stage.

## When to use
Use whenever work arrives from another agent, human, session, or resumed checkpoint.

## Inputs
- handoff record;
- current repository state;
- task instructions and policy;
- referenced artifacts and approvals.

## Preconditions
The handoff record is readable and the receiving actor has access to referenced non-secret artifacts.

## Process
1. Validate the record deterministically.
2. Recompute fingerprints for referenced files.
3. Compare handoff scope with the current task.
4. Check that decisions are supported by evidence or explicitly marked as judgment.
5. Re-evaluate unverified assumptions that affect the receiving stage.
6. Confirm unresolved risks have owners and do not exceed policy thresholds.
7. Confirm approvals still apply to the exact planned action.
8. Check completion and verification states for illegal promotion.
9. Inspect whether repository changes since handoff invalidate evidence.
10. Choose one result: `accepted`, `revise`, or `blocked`.
11. If accepted, record acceptance timestamp and receiver identity in the next ledger record; do not mutate historical handoff content.

## Allowed tools
Repository read tools, deterministic scripts in this kit, build/test outputs, version-control status/diff tools.

## Constraints
Do not accept a handoff merely because the producer is authoritative. Do not silently repair missing evidence and then pretend the original handoff was valid.

## Expected output
A review decision with reasons and explicit inherited state.

## Verification
Acceptance requires deterministic checks to pass and no unresolved blocking semantic issue.

## Failure handling
Request revision for repairable omissions. Block for missing approval, invalid evidence, scope conflict, or prohibited action. Maximum two revision cycles.

## Stop conditions
Stop before execution when artifacts are stale, a blocking risk is unresolved, or verification state is ambiguous.