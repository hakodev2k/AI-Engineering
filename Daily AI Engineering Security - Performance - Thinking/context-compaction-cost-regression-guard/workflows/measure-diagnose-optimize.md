# Workflow: Measure, Diagnose, Optimize Compaction

## Trigger
A compaction implementation, prompt-prefix layout, context threshold, or tool/agent metadata path changes.

## Goal
Reduce compaction cost/context pressure without losing quality-critical state.

## Inputs
Stable fixture, baseline telemetry, candidate build, thresholds, critical markers.

## Baseline
Run the fixture before the change and record tokens/task, cached/uncached input, post/pre token ratio, repeated payload bytes, latency, and turns to next compaction.

## Stages
1. **Observe** — capture the compaction boundary and subsequent turns.
2. **Measure baseline** — normalize usage fields and repeated payload sizes.
3. **Diagnose** — identify prefix drift, repeated attachments, stale accounting, or summary loss.
4. **Form hypothesis** — document one falsifiable cause and expected metric movement.
5. **Implement improvement** — make the smallest change that addresses the cause.
6. **Measure again** — repeat the same fixture.
7. **Improved?** — run `scripts/compaction_regression_guard.py`; if no, revise once.
8. **Verify** — independent verifier reruns tests and compares traces.

## Responsible agent
Implementation owner for stages 1–7; `subagents/verification-agent.md` for stage 8.

## Tools
Provider usage logs, trace analyzer, guard script, unit tests.

## Outputs
Before/after telemetry, guard result, root-cause note, verification decision.

## Checkpoints
Before implementation, after first candidate measurement, and before release.

## Metrics
Uncached-input ratio, post/pre token ratio, repeated payload bytes, turns between compactions, retained critical markers, p50/p95 latency when enough samples exist.

## Retry policy
Maximum one corrective retry after the first failed candidate.

## Stop conditions
Critical-marker loss, security/correctness regression, missing baseline, or second failed candidate.

## Failure path
Restore previous behavior or disable the candidate path; preserve normalized evidence; escalate provider-specific ambiguity.

## Verification
Independent verifier must reproduce a passing guard result.

## Definition of Done
Baseline captured; gap identified; improvement implemented; tests pass; before/after metrics recorded; critical context preserved; independent verification complete; no blocking issue remains.
