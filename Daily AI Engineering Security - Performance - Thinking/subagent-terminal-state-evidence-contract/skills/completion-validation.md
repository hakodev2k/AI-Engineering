# Skill: Subagent Completion Validation

## Purpose
Convert delegated work from a weak process-stop signal into an evidence-backed task-completion decision.

## Trigger
Every subagent/delegated-task return, especially long-running or high-cost work.

## Inputs
Terminal reason, final result, expected deliverables, actual deliverables, unresolved actions, verification evidence, checkpoint references.

## Preconditions
Acceptance criteria are known before delegation.

## Required context
Observable task requirements and artifacts only; do not request hidden chain-of-thought.

## Allowed tools
Read-only artifact inspection, tests, and `scripts/validate_completion.py`.

## Constraints
MUST NOT treat `completed` as sufficient by itself. MUST NOT infer a missing deliverable from a textual claim. Dangerous or irreversible actions require human approval.

## Procedure
1. Define expected deliverables and verification requirements before delegation.
2. Require a completion envelope.
3. Validate terminal reason.
4. Verify final result is present and self-contained.
5. Compare expected versus delivered artifacts.
6. Check unresolved actions.
7. Verify required evidence and independent review.
8. If invalid, mark `incomplete` and recover from a checkpoint if possible.
9. Retry the child at most once.

## Decision points
A failed/deferred terminal reason is never success. Missing required artifacts mean incomplete. A non-empty fragment without required deliverables is incomplete.

## Expected output
Facts, envelope result, missing evidence, recovery path, final status.

## Metrics
False-success rate, recovery rate, rerun rate, rework tokens/time, verification coverage.

## Verification
Independent verifier reproduces at least one success and each known false-success fixture.

## Failure handling
Prefer checkpoint recovery; otherwise one bounded retry. Escalate after retry failure.

## Stop conditions
One recovery attempt plus one child retry maximum.
