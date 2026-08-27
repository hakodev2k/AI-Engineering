# Skill: Critical-Step Analysis

## Purpose
Localize the earliest observable step where a long-horizon agent trajectory becomes risky, unsupported, or dependent on unresolved assumptions.

## Trigger
Long-running coding/tool tasks, failed autonomous runs, unsupported completion claims, repeated retries, or review of a multi-agent trajectory.

## Inputs
Structured trajectory events, evidence ledger, assumptions, acceptance criteria, deterministic test results, and relevant artifacts.

## Preconditions
Steps are ordered; evidence and assumptions have stable IDs; the task's acceptance criteria are explicit enough to verify.

## Required context
Only observable artifacts and explicit status fields. Hidden chain-of-thought is not requested or required.

## Allowed tools
Repository/file inspection, test runners, static analyzers, logs, `scripts/trajectory_guard.py`, independent read-only verification.

## Constraints
- MUST separate Facts, Evidence, Assumptions, Hypotheses, Decisions, Risks, and Verification status.
- MUST NOT treat self-reported progress as evidence.
- MUST NOT continue an unverified loop beyond the configured checkpoint span.
- MUST NOT let the implementing agent be the only verifier for high-impact completion.

## Procedure
1. Confirm task requirements and acceptance criteria.
2. Assign IDs to facts/evidence and active assumptions.
3. Run the trajectory guard and note the first risk step.
4. Inspect that step and the immediately preceding verified checkpoint.
5. Test the smallest falsifiable hypothesis explaining the divergence.
6. Resolve or invalidate assumptions with evidence.
7. Replan from the last verified checkpoint rather than continuing from corrupted state.
8. Require independent verification before final completion.

## Decision points
Pause/replan on unsupported completion, unresolved critical assumptions, failed verification, or an excessive span without a verified checkpoint.

## Expected output
First risk step; supporting evidence; unresolved assumptions; recovery checkpoint; independent verification requirement.

## Metrics
Median steps to first detected risk; unsupported-completion count; unresolved-assumption count at completion; verification coverage; rework after final review; retries per failure.

## Verification
A reviewer distinct from the implementer reproduces the decisive checks from artifacts, not from the implementer's narrative.

## Failure handling
Maximum 2 recovery attempts from the last verified checkpoint. Preserve original trace. Escalate if evidence remains ambiguous.

## Stop conditions
Stop on exhausted retries, contradictory acceptance criteria, missing evidence required for a consequential decision, or inability to produce an independent verification path.
