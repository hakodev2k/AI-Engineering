# Skill: Plan-Approval Recovery

## Purpose
Recover a long-running agent after lifecycle interruption without losing, fabricating, or repeatedly requesting human plan approval.

## Trigger
Worker restart, session resume, compaction, plan-mode transition, workspace revision change, or suspected approval loop.

## Inputs
Current plan bytes, receipt, task ID, workspace revision, phase, policy, lifecycle event.

## Preconditions
The receipt store is separate from model-generated text and the current workspace revision can be identified.

## Required context
Current task identity, execution phase, explicit approval policy, prior lifecycle state.

## Allowed tools
Read-only plan/receipt access, hashing, workspace revision lookup, deterministic receipt validator, audit log.

## Constraints
Never infer consent. Never reconstruct a missing receipt from model output. Never expose or request hidden chain-of-thought.

## Procedure
1. Record lifecycle event and current task/workspace identity.
2. Load durable receipt; if absent, transition to `AWAITING_APPROVAL`.
3. Hash exact current plan bytes.
4. Run `scripts/plan_receipt_guard.py` for the intended phase.
5. If VALID, deduplicate the approval and resume only the scoped phase.
6. If BLOCKED, preserve findings and request fresh human approval only after the plan/workspace state is stabilized.
7. Detect repeated identical approval requests by task + plan hash + approval ID; do not re-plan while merely waiting.
8. Permit at most two recovery attempts.
9. Independent Verification Agent reproduces the validation before completion.

## Decision points
VALID receipt → resume. Missing/mismatch/expired/out-of-phase receipt → await approval. Ambiguous state → fail closed.

## Expected output
Lifecycle state, plan hash, receipt validation result, resume/await decision, retry count, verification status.

## Metrics
Duplicate approval prompts, valid-resume rate, stale continuation count, loop count, rework due to lost state.

## Verification
Tests cover valid resume plus plan, workspace, time, phase, and approver drift.

## Failure handling
Preserve the receipt and evidence; do not mutate approval to force progress.

## Stop conditions
Two failed recovery attempts, missing human approval, changing plan/workspace during validation, or independent verification failure.