# Skill: Safe Resume Analysis

## Purpose
Determine whether a paused task can safely continue and identify the exact next action without repeating or skipping work.

## When to use
Use whenever a task resumes after interruption, context reset, agent handoff, rate limit, crash, or deliberate pause.

## Inputs
- `checkpoint-state.json`.
- Current Git status, branch, and commit.
- Current environment identifiers.
- Evidence for recorded external side effects.

## Preconditions
- Checkpoint passes structural validation or can be reconstructed from durable evidence.
- The agent can inspect current repository/environment state.

## Process
1. Validate checkpoint structure.
2. Read objective, baseline, current stage, last successful event, failures, pending approvals, and `next_action`.
3. Compare recorded branch/commit and changed resources with current state.
4. Re-check external side effects that could be non-idempotent.
5. Classify differences as expected continuation, benign external drift, conflicting modification, or unknown outcome.
6. For expected continuation, resume from `next_action`.
7. For benign drift, record evidence and update the checkpoint before proceeding.
8. For conflicting modification, stop and require reconciliation.
9. For unknown non-idempotent outcome, do not retry; block and escalate.
10. Recalculate retry budget for the current failure fingerprint.
11. Confirm approvals are still valid and scoped to the current action.
12. Emit a resume decision: `continue`, `reconcile`, `blocked`, or `restart-stage`.

## Tools
Git inspection, repository reads, safe read-only external queries, checkpoint scripts, and test/build tools when needed to verify state.

## Constraints
- Never assume the last tool call failed merely because the response was lost.
- Never silently restart a completed stage.
- Approval from one action must not be generalized to another action.
- Do not mutate repository state while still classifying drift.

## Expected output
A resume decision with evidence, remaining retry budget, exact next action, and any blocking approval or ambiguity.

## Verification
The decision must be explainable from checkpoint plus current observable state; the resume summary script must agree with checkpoint stage/status.

## Failure handling
If current state cannot be matched to recorded state, stop and preserve both observations. Do not repair history by guessing.

## Stop conditions
Stop on unknown external side effects, conflicting repository changes, exhausted retry budget, missing approval, or unverifiable checkpoint history.
