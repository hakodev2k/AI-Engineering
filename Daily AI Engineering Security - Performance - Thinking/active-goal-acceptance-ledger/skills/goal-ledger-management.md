# Skill: Goal Ledger Management

## Purpose
Keep the user's active deliverable and completion criteria durable across long sessions, corrections, compaction, subagents, and supporting work.

## Trigger
At task start, after a material user correction, before delegation, after compaction/resume, and before any terminal completion claim.

## Inputs
User request, acceptance criteria, known constraints, planned deliverables, current evidence, corrections.

## Preconditions
The task has at least one observable completion criterion.

## Required context
Only externally observable facts, assumptions, decisions, evidence references, and statuses. Hidden chain-of-thought is never requested.

## Allowed tools
Read/write ledger file, test runners, repository inspection, evidence verifier.

## Constraints
Criterion IDs are immutable once issued. Required criteria may be superseded only with an explicit reason and lineage. Supporting artifacts cannot substitute for the requested deliverable unless the user changed the goal.

## Procedure
1. Create `goal_id`, deliverable type, and immutable acceptance rows.
2. For each row record status: `open`, `in_progress`, `evidence_ready`, `verified`, `blocked`, or `superseded`.
3. Record evidence references, verifier, and dependencies.
4. On correction, append a correction event and invalidate every dependent row/evidence item.
5. Before delegation, pass only relevant rows and require a structured handoff keyed by criterion IDs.
6. On return, merge evidence without allowing subagents to mark independent-verification rows as verified.
7. Before terminal response, run the finalization gate.
8. If required rows remain open/blocked, continue bounded work or report incomplete/blocked rather than `done`.

## Decision points
If criterion is subjective/unmeasurable, convert it to observable evidence before implementation. High-risk or broad changes require independent verifier. If evidence is stale after a correction, revert row to open/in_progress.

## Expected output
A machine-readable ledger plus a concise status summary: Facts, Assumptions, Evidence, Decisions, Risks, Verification status.

## Metrics
Premature completion rate, verified-criterion coverage, rework after correction, invalidation propagation success, number of deleted/lost criteria (target zero).

## Verification
Ledger validation script passes; required rows are verified with current evidence; deliverable exists independently of meta-work.

## Failure handling
Retry ledger reconciliation twice. If lineage or acceptance state cannot be reconstructed reliably, block completion and escalate with exact missing evidence.

## Stop conditions
Stop when all required rows are verified, or when a real blocker prevents further progress and is recorded with evidence.