# Skill: Durable Subagent Handoff Design

## Purpose
Turn subagent completion from a transient status/message into an explicit, parent-verifiable deliverable contract.

## Trigger
Use for long-running, expensive, parallel, headless, or failure-prone delegated tasks where losing the final child response would cause significant rework.

## Inputs
Task acceptance criteria, handoff policy, child terminal metadata, deliverable content or artifact, verification evidence, and optional checkpoints.

## Preconditions
The parent/orchestrator can intercept child completion before marking the delegated task accepted. Artifact paths must be readable by the parent when artifact handoff is used.

## Required context
Know the task's required output form, whether side effects were expected, which terminal reasons indicate unfinished work, and what evidence proves the deliverable is complete.

## Allowed tools
Child status/result APIs, durable artifact storage, hashing, test/review tools, and `scripts/validate_handoff.py`.

## Constraints
- MUST NOT treat `completed`, `success`, or `is_error=false` as sufficient proof of delivery.
- MUST NOT request hidden chain-of-thought.
- MUST preserve security and access boundaries when storing artifacts.
- SHOULD checkpoint externally useful facts/evidence during long tasks without persisting sensitive reasoning traces.

## Procedure
1. Define acceptance criteria before dispatch.
2. Choose `inline` or `artifact` deliverable kind.
3. For artifact handoff, persist the artifact before terminal success and compute SHA-256.
4. Record terminal state/reason and any unfinished/deferred tool calls.
5. Attach explicit verification evidence such as test results, review identifiers, or source references.
6. Validate the envelope before parent acceptance.
7. If rejected, classify whether the child can resume from a durable checkpoint or must restart.
8. Retry at most twice; every retry MUST address a specific blocking reason.
9. Require independent verification for high-impact code/security changes.

## Decision points
- Missing deliverable but recoverable checkpoint: resume/reconstruct, do not mark complete.
- Terminal reason indicates deferred/unfinished action: reject regardless of non-error outer status.
- Digest mismatch: reject and treat artifact integrity as unknown.
- Valid short output below generic length threshold: customize policy only when task acceptance criteria justify it.

## Expected output
Accepted handoff envelope plus actual retrievable deliverable, or a reject report with explicit recovery path.

## Metrics
Completion-without-deliverable rate, false-success rate, digest pass rate, recoverable-partial rate, retry count, and verification coverage.

## Verification
Run the deterministic validator and task-specific checks. Parent MUST retrieve the actual deliverable and verify required acceptance evidence.

## Failure handling
Preserve checkpoints and reject completion. Avoid blind full reruns when usable evidence exists. Escalate after two failed recovery attempts or when integrity cannot be established.

## Stop conditions
Two unsuccessful recovery/retry attempts, missing required artifact with no checkpoint, conflicting terminal metadata, or any dangerous side effect requiring human approval.
