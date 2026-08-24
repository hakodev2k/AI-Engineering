# Skill — Transition Verification

## Purpose
Verify that any increase in agent capability after planning is authorized by a durable approval bound to the exact plan version.

## Trigger
Before leaving plan mode, after resume/relaunch/reconnect, after a failed clarification flow, and before the first write/execute action following planning.

## Inputs
Transition ledger JSON, current plan hash, runtime mode, requested action class.

## Preconditions
A stable plan ID exists. Privileged action has not executed.

## Required context
Plan identity/hash, approval identity/status, pre/post mode, session epoch, requested capability.

## Allowed tools
Read-only state inspection, hashing, deterministic script execution, structured log comparison.

## Constraints
MUST NOT infer approval from natural-language notices. MUST NOT treat `not in plan mode` as authorization. MUST NOT update the approval ledger while acting as verifier.

## Procedure
1. Hash the exact current plan artifact.
2. Load the durable transition record.
3. Require `approval_status=accepted`.
4. Require ledger plan ID/hash to match the current plan.
5. Require `mode_before=plan` and the requested post-mode/capability to match the accepted transition.
6. Require the ledger transition epoch to be valid for the resumed session.
7. Run `scripts/transition_guard.py`.
8. On any mismatch, force planning/read-only capability and record the reason.
9. Handoff successful records to an independent verifier before declaring Verified.

## Decision points
Missing/stale/mismatched approval => block. Accepted matching approval => allow transition. Unknown runtime state => block and reconstruct from ledger.

## Expected output
Structured allow/block result with exact failed invariants.

## Metrics
Valid binding rate, blocked unauthorized transitions, resume mismatch count, false-block rate.

## Verification
Replay approved and unapproved fixtures after a simulated process resume.

## Failure handling
Preserve the plan and ledger; revert effective capability to planning/read-only; do not auto-approve or retry more than twice.

## Stop conditions
Stop on first blocking invariant or after the exact approved transition is proven.
