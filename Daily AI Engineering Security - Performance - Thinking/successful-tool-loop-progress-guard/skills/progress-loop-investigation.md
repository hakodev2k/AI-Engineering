# Skill: Progress Loop Investigation

## Purpose
Diagnose repeated successful tool activity that does not advance an agent's task.

## Trigger
High tool-call count, repeated queries, token spike, recursion-limit hit, user reports of looping, or stalled subgoal.

## Inputs
Observable tool trace, task/subgoal IDs, result fingerprints, progress markers, token/time metrics, completion criteria.

## Preconditions
Trace data must not require hidden chain-of-thought. Define observable task progress before tuning thresholds.

## Required context
Facts, assumptions, current hypotheses, unresolved subgoals, decision criteria, verification status.

## Allowed tools
Trace/log readers, deterministic fingerprinting, test runner, repository read tools.

## Constraints
Do not infer internal reasoning. Do not treat repeated calls as a loop when state/progress is changing.

## Procedure
1. Establish baseline calls, tokens, duration, and point of last progress.
2. Partition trace by active subgoal.
3. Normalize each event to action, target, result fingerprint, progress marker.
4. Find repeated signatures inside a bounded window.
5. Confirm whether progress marker stayed constant.
6. Record Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
7. Test root-cause hypotheses: stale query, wrong tool, missing requirement, inaccessible evidence, planner drift.
8. Recovery attempt 1 must change one observable strategy dimension.
9. If still stalled, recovery attempt 2 must change a different dimension or narrow/escalate the subgoal.
10. Independently verify completion evidence.

## Decision points
Repeated signature + unchanged progress: block and recover. Repetition + advancing progress: allow. Unknown progress semantics: stop and require instrumentation.

## Expected output
Loop signature, last-progress point, root cause, bounded recovery decision, verification evidence.

## Metrics
Calls without progress, tokens/time since progress, recovery success, false-positive blocks, rework.

## Verification
Replay known loop and legitimate-progress traces.

## Failure handling
At most two recovery attempts.

## Stop conditions
Two failed recoveries, inaccessible required evidence, or recovery would require dangerous action without approval.