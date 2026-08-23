# Workflow: Measure, Optimize, Verify Browser Observations

## Trigger
A browser workflow exceeds context, quota, compaction, or latency targets.

## Goal
Reduce observation-driven context growth while preserving task correctness and required evidence.

## Inputs
Representative browser trace, context budget, task acceptance criteria.

## Baseline
Record total and browser-attributable bytes/tokens, full DOM snapshots, screenshots, duplicates, model/tool calls, compactions, elapsed time, and completion quality.

## Stages
1. **Observe** — capture an unmodified trace.
2. **Measure** — run `scripts/observation_budget.py`.
3. **Diagnose** — rank duplicate and oversized observations.
4. **Hypothesize** — choose exactly one change: deduplicate, target, delta, modality reduction, or stale eviction.
5. **Optimize** — apply the narrow policy change.
6. **Measure again** — replay the representative task.
7. **Compare** — require measurable budget improvement and no quality regression.
8. **Independent verification** — Browser Budget Verifier checks suppressed evidence and final state.
9. **Complete or rollback** — retain only verified improvements.

## Responsible agent
Token/performance investigator; independent verifier owns final evidence review.

## Tools
Trace collector, profiler, browser test harness, model usage telemetry.

## Outputs
Baseline report, candidate report, comparison, verified policy.

## Checkpoints
Baseline frozen before optimization; one hypothesis per replay; independent review before rollout.

## Metrics
Observation tokens/task, duplicate ratio, p95 observation size, context utilization, compactions, tool/model calls, latency, completion rate.

## Retry policy
At most three hypotheses. Never repeat the same failed hypothesis unchanged.

## Stop conditions
Target met; three unsuccessful hypotheses; or any evidence/quality regression that cannot be corrected without restoring context.

## Failure path
Rollback optimization, preserve baseline evidence, document why the reduction was unsafe, escalate architectural issues to the tool/runtime owner.

## Verification
Profiler tests pass; before/after report shows improvement; verifier confirms equivalent required evidence.

## Definition of Done
Implemented policy is measured and independently verified; no critical context loss remains; completion and safety evidence are preserved.
