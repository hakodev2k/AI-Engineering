# Skill: Liveness Analysis

## Purpose
Determine whether an agent loop is making observable progress toward the active goal.

## Trigger
Use at every continuation/retry checkpoint and after any iteration that produces only status, planning, review, or orchestration output.

## Inputs
Active goal, acceptance criteria, iteration events, verified file/test/evidence deltas, blocker set, hypothesis ID, token/time counters.

## Preconditions
Acceptance criteria are explicit enough to evaluate. Progress events are machine-readable where possible.

## Required context
Current deliverable, latest user corrections, dependencies, verification requirements, and stop budget.

## Allowed tools
Read-only state inspection, diff/test/result readers, deterministic liveness evaluator.

## Constraints
Do not count prose status updates, repeated plans, unchanged reviews, or duplicate evidence as progress. Do not expose hidden chain-of-thought; use observable facts, assumptions, hypotheses, decisions, and verification status.

## Procedure
1. Snapshot active goal and unsatisfied acceptance criteria.
2. Record iteration events: files changed, tests newly passing, criteria newly satisfied, blockers removed, verified evidence added.
3. Assign progress points only to new, goal-relevant state deltas.
4. Compare hypothesis ID to prior failed/no-progress iteration.
5. Increment no-progress streak when score is zero.
6. If streak reaches warning threshold, require a changed hypothesis or explicit blocker.
7. If streak reaches stop threshold, stop autonomous continuation and escalate.
8. Reset streak only after measurable progress, not after new prose.

## Decision points
- Score > 0: continue within normal budget.
- Score = 0 and hypothesis changed: allow one bounded experiment.
- Score = 0 and hypothesis unchanged: do not retry blindly.
- Stop threshold reached: halt and report exact evidence/blocker.

## Expected output
Facts, active criteria, progress score, no-progress streak, hypothesis status, decision, risks, verification status.

## Metrics
Progress events/iteration, criteria completed/iteration, no-progress streak length, tokens per accepted criterion, repeated-hypothesis attempts, forced-stop rate.

## Verification
Replay productive and stagnant fixtures and confirm only goal-relevant state deltas reset the streak.

## Failure handling
If progress evidence cannot be measured, mark indeterminate and require a human checkpoint for long-running autonomous continuation.

## Stop conditions
Configured no-progress limit, repeated unchanged hypothesis, missing acceptance criteria, or explicit blocker requiring human action.