# Workflow: Preflight → Execute → Verify

## Trigger
A task proposes deletion, recursive cleanup, or a filesystem-destructive command.

## Goal
Permit only destructive operations whose exact targets are authorized and independently verifiable.

## Inputs
Command, working directory, allowed roots, exact target manifest, policy, optional human approval.

## Baseline
Record proposed target count, target paths/hashes where applicable, command hash, workspace identity, and current VCS status/read-only inventory.

## Context
The command is untrusted until preflight completes. Parent-agent permission state does not grant destructive authorization to children.

## Stages
1. **Observe** — capture requested outcome and exact intended targets. Responsible: coordinator.
2. **Measure baseline** — record read-only filesystem/VCS evidence. Responsible: verifier.
3. **Diagnose** — run the deterministic guard. Responsible: coordinator.
4. **Form hypothesis** — if blocked/review, identify the narrowest reason: ambiguity, breadth, recursion, out-of-root, or intent mismatch.
5. **Implement improvement** — rewrite only the command/operation to remove that reason; do not broaden the manifest. Responsible: implementation agent.
6. **Measure again** — rerun guard. Maximum 2 remediation cycles.
7. **Execute** — only after `allow`, or after explicit human approval for a reviewed operation and a fresh guard pass tied to the approved manifest.
8. **Verify** — independent verifier compares actual changes with the approved set.

## Tools
`python scripts/destructive_guard.py`, read-only stat/VCS inventory, platform executor after approval.

## Outputs
Preflight JSON, baseline evidence, approval record if needed, postcondition evidence, final verification state.

## Checkpoints
Before execution: decision and hashes stable. After execution: changed target set captured. Final: independent verification complete.

## Metrics
Blocked/review/allow counts; unexpected-change count; remediation attempts; verification failures; incident rate.

## Retry policy
At most 2 command-remediation attempts. No automatic retry after an execution with unexpected postconditions.

## Stop conditions
Stop on block with no narrower formulation, second failed remediation, approval denial/expiry, any unexpected changed target, or verifier `INCONCLUSIVE` after one evidence refresh.

## Failure path
Preserve evidence, stop mutation, restore from version control/backup only with explicit scope, and escalate to the human owner. Never “fix” the failure by broadening allowed roots or disabling the guard.

## Verification
The implementing agent cannot be the sole verifier.

## Definition of Done
Evidence documented; preflight passed; required approval captured; execution changed only authorized targets; regression tests pass; independent verifier returns `VERIFIED`; no blocking issue remains.
