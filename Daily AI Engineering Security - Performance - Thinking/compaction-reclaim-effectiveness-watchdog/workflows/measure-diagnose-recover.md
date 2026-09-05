# Workflow: Measure, Diagnose, Recover

## Trigger
Ineffective or repeated compaction signal.

## Goal
Restore measurable context reclaim without inducing data loss or an autonomous loop.

## Inputs
Trace, capacity, compaction policy, workload.

## Baseline
Record tokens before/after, reclaim ratio, post utilization, compactions/task, tokens/task, latency and task-quality result.

## Context
Separate active context from cumulative usage and identify static/injected context where possible.

## Stages
1. Observe compaction trace.
2. Measure baseline.
3. Diagnose metric/state/retention failure.
4. Form one falsifiable hypothesis.
5. Implement smallest correction.
6. Replay same workload.
7. Measure again.
8. If not improved, re-evaluate once.
9. Run independent verification.

## Responsible agent
Context investigator/implementer; Token Verifier for final step.

## Tools
Logs, token counter/provider usage, watchdog, regression tests.

## Outputs
Root cause, implementation, before/after metrics, quality result, verifier decision.

## Checkpoints
After an ineffective compaction, automatic retrigger remains blocked until recount/diagnosis completes.

## Metrics
Reclaim ratio, post utilization, compactions/task, tokens/task, summary overhead, latency, quality/regression.

## Retry policy
Maximum 1 recount and 2 implementation hypotheses.

## Stop conditions
Persisting ineffective compaction after bounded attempts, unknown metric semantics, or critical context loss.

## Failure path
Keep circuit breaker active, preserve trace, use safe manual recovery with human approval if required, escalate.

## Verification
Independent replay plus quality/context-retention checks.

## Definition of Done
Compaction postconditions pass, cost/latency is improved or stable, and result quality is not materially worse.