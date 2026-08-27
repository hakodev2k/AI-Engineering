# Skill: Post-Compaction Grounding

## Purpose
Restore reliable task state after context compaction using observable evidence rather than hidden reasoning.

## Trigger
Automatic/manual compaction, session handoff, long-context degradation signal, or resumed compacted session.

## Inputs
Compaction summary, repository/task state, test results, user constraints, and retry counters.

## Preconditions
Read-only verification tools are available.

## Required context
Explicit Facts, Assumptions, Claims, Evidence, Risks, Decision, and Verification status.

## Allowed tools
File reads, git status/diff, test runner, task-tracker reads, and logs.

## Constraints
- MUST NOT ask for or record hidden chain-of-thought.
- MUST NOT treat summary claims as verified merely because they appear in the summary.
- MUST preserve user constraints and safety boundaries.

## Procedure
1. Extract externally checkable claims from the compacted state.
2. Mark critical claims: files changed, tests pass, branch state, permissions, deployment state, acceptance criteria.
3. Verify each critical claim against current external evidence.
4. Restore loop attempt/max-attempt counters and the current hypothesis.
5. Run `scripts/checkpoint_verify.py`.
6. Continue only on pass.

## Decision points
A contradicted or unverified critical claim blocks consequential actions.

## Expected output
Machine-readable checkpoint plus concise Facts, Evidence, Risks, Decision, and Verification status.

## Metrics
Critical verification coverage, contradictions caught, repeated-action count, failed-loop count, and rework rate.

## Verification
An independent agent reviews critical evidence before final completion.

## Failure handling
At most 2 repair cycles; then stop and escalate the unresolved claim.

## Stop conditions
Retry budget exhausted, contradictory critical state, unavailable required evidence, or safety-boundary ambiguity.
