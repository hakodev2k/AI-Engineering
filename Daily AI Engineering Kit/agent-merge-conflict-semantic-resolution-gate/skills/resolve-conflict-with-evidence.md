# Resolve Conflict With Evidence

## Purpose
Apply the smallest semantic resolution that satisfies the intended combined behavior and leaves evidence suitable for independent verification.

## Inputs
- Signed conflict inventory.
- Resolution decision contract.
- Relevant tests/build commands.

## Process
1. Confirm inventory revision and conflict IDs still match the current worktree.
2. Resolve one conflict at a time; preserve unrelated edits.
3. Implement the declared merged behavior, not merely marker removal.
4. Never discard a side silently. If neither side is retained, document why and what replaces it.
5. Run targeted checks listed for that conflict.
6. Re-scan for conflict markers.
7. Run `scripts/evaluate-resolution.py` against the exact inventory, decision, policy, and repository root.
8. If status is `blocked`, fix only the reported blocker and re-evaluate. Maximum automatic resolution cycle: 1.
9. If `review-required`, hand off the immutable report fingerprint to the independent verifier.
10. Inspect final diff for unrelated or generated noise.

## Verification
A resolution is executed when files are edited and targeted checks run. It is verified only when `scripts/verify-final-gate.py` returns `verified` and any required human approvals are separately satisfied.

## Failure handling
- Validation/build/test failure: preserve output and stop after one remediation cycle.
- Permission/environment failure: stop; do not broaden permissions.
- Unknown business intent: stop and escalate.
- New conflicts after rebase/merge movement: regenerate inventory; old evidence is stale.

## Stop conditions
Never force-push, deploy, alter production configuration, execute destructive SQL, weaken security, or make irreversible migrations without explicit approval.
