# Workflow: Preflight → Execute → Verify

## Trigger
A task proposes deletion, recursive cleanup, or another filesystem-destructive operation.

## Goal
Permit only destructive operations whose exact targets are authorized and independently verifiable.

## Inputs
Structured operation, working directory, candidate targets, allowed roots, exact authorized target manifest, recursive/recoverable flags, policy, optional human approval.

## Baseline
Record proposed target count, target paths/hashes where applicable, workspace identity, and current VCS/read-only inventory.

## Context
The operation is untrusted until preflight completes. Parent-agent permission state does not grant destructive authorization to children.

## Stages
1. **Observe** — capture requested outcome and exact intended targets. Responsible: coordinator.
2. **Measure baseline** — record read-only filesystem/VCS evidence. Responsible: verifier.
3. **Diagnose** — run `python scripts/target_guard.py --input <request.json> --policy config/policy.json`. Responsible: coordinator.
4. **Form hypothesis** — if blocked/review, identify the narrowest reason: ambiguous expression, recursion, unrecoverable semantics, out-of-root target, or intent mismatch.
5. **Implement improvement** — narrow the structured operation or choose a recoverable API; never broaden the authorized manifest merely to pass. Responsible: implementation agent.
6. **Measure again** — rerun guard. Maximum 2 remediation cycles.
7. **Execute** — only after `allow`, or after explicit human approval for a reviewed operation plus a fresh preflight tied to the approved manifest.
8. **Verify** — independent verifier compares actual changes with the approved set.

## Tools
`python scripts/target_guard.py`, read-only stat/VCS inventory, platform executor after approval.

## Outputs
Preflight JSON, baseline evidence, approval record if needed, postcondition evidence, final verification state.

## Checkpoints
Before execution: target manifest and decision stable. After execution: changed target set captured. Final: independent verification complete.

## Metrics
Blocked/review/allow counts; unexpected-change count; remediation attempts; verification failures; incident rate.

## Retry policy
At most 2 remediation attempts. No automatic retry after an execution with unexpected postconditions.

## Stop conditions
Stop on block with no narrower formulation, second failed remediation, approval denial/expiry, any unexpected changed target, or verifier `INCONCLUSIVE` after one evidence refresh.

## Failure path
Preserve evidence, stop mutation, restore from version control/backup only with explicit scope, and escalate. Never “fix” failure by broadening allowed roots or disabling the guard.

## Verification
The implementing agent cannot be the sole verifier. Run `python -m unittest tests/test_target_guard.py` for the deployed package.

## Definition of Done
Evidence documented; baseline captured; preflight passed; required approval captured; execution changed only authorized targets; tests pass; independent verifier returns `VERIFIED`; no blocking issue remains.
