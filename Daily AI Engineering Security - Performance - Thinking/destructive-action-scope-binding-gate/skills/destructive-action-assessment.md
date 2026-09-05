# Skill: Destructive Action Assessment

## Purpose
Convert user intent and a planned destructive mutation into an auditable, machine-checkable authorization envelope.

## Trigger
Before delete, overwrite, reset, clean, archive, terminate, revoke, or equivalent irreversible/high-impact mutation.

## Inputs
User request; planned operation; normalized targets; current target fingerprints; policy; actor/session identity; approval record.

## Preconditions
Read-only inspection is available. Destructive execution has not started.

## Required context
Only observable intent evidence, planned action, policy, and target state. Hidden chain-of-thought is neither needed nor permitted.

## Allowed tools
Read/stat/hash/list operations, policy checker, approval UI/API, audit logger.

## Constraints
MUST NOT widen target scope. MUST NOT treat writable-root permission as user authorization. MUST NOT let model-controlled parameters suppress mandatory confirmation.

## Procedure
1. Classify the semantic operation (`delete`, `overwrite`, `archive`, etc.).
2. Normalize every target to an unambiguous identifier.
3. Resolve globs/recursive targets before approval.
4. Fingerprint target state using safe metadata/hash where practical.
5. Compare targets with explicit user-intent evidence.
6. Apply policy and obtain human approval if required.
7. Build an envelope with operation, targets, fingerprints, expiry, nonce, and approval metadata.
8. Immediately before execution, run `scripts/scope_gate.py` against the exact planned action.
9. Execute once only after PASS.
10. Record postconditions and hand off to independent verification.

## Decision points
Unknown/changed target -> block. Planned target not explicitly approved -> block. Operation semantic differs from approval -> block. High-risk class without human approval -> block.

## Expected output
Authorization envelope, gate result, audit evidence, postcondition request.

## Metrics
Target coverage %, mismatch blocks, stale-state blocks, human-approval coverage, unauthorized destructive incidents.

## Verification
Independent verifier compares user intent, envelope, actual mutation log, and post-state.

## Failure handling
Rebuild from current state once. If still ambiguous, stop and escalate.

## Stop conditions
Any missing approval, ambiguous destructive scope, state drift, policy violation, or second failed authorization attempt.