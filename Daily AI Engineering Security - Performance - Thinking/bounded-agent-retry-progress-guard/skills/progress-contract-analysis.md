# Skill: Progress Contract Analysis

## Purpose
Convert vague agent persistence into observable progress criteria and bounded recovery behavior.

## Trigger
Long-running tasks, repeated tool/model actions, recurring provider errors, compaction cycles, or reports of agents hanging while “thinking”.

## Inputs
Run trace, action signatures, retry events, progress markers, task acceptance criteria, retry policy.

## Preconditions
At least one observable definition of progress such as a new passing test, reduced failing-test count, new evidence, completed subtask, or materially changed artifact.

## Required context
Task goal, current evidence, explicit stop conditions, and recent run events. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Trace readers, deterministic guard, test/benchmark commands, read-only logs.

## Constraints
MUST NOT define progress as “the model says it is making progress”. MUST NOT increase retry limits to hide a failing loop.

## Procedure
1. State the task goal and measurable acceptance criteria.
2. Define progress events before the loop starts.
3. Normalize tool/model operations into stable action signatures.
4. Capture a baseline trace.
5. Run the deterministic retry/progress guard.
6. Classify the stall as provider retry, repeated action, compaction/recovery loop, or missing progress evidence.
7. Form one recovery hypothesis and allow at most two materially different recovery attempts.
8. Halt and escalate if the guard budget is exhausted.

## Decision points
Continue only with remaining budget and observable progress; otherwise halt.

## Expected output
Facts, Evidence, Hypothesis, Decision, Remaining budget, Risks, Verification status.

## Metrics
Retries/task, repeated-action streak, no-progress steps, time-to-escalation, tokens spent after last progress event, recovery success rate.

## Verification
Independent verifier confirms that recorded progress corresponds to task state rather than narrative claims.

## Failure handling
Persist the last successful checkpoint and concise failure evidence; do not restart the same sequence automatically.

## Stop conditions
Any configured budget exhaustion, dangerous repeated action, two failed recovery hypotheses, or inability to observe progress.
