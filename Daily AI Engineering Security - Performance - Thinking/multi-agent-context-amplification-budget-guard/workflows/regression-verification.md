# Workflow: Token Regression Verification

## Trigger
Change to subagent inheritance, compaction, asset handling, or model routing.

## Goal
Prove lower token/context amplification without correctness regression.

## Inputs
Baseline trace, optimized trace, quality tests, dispatch plans.

## Baseline
Same representative task, same acceptance criteria, comparable model settings.

## Stages
1. Record baseline tokens, network bytes, compactions, latency, and result quality.
2. Apply context-budget change.
3. Re-run representative workload.
4. Record the same metrics.
5. Compare amplification and task quality.
6. Reject optimization if critical context was lost or quality regressed beyond policy.

## Retry policy
One corrective change plus one re-run.

## Stop conditions
Security/correctness regression, missing comparable baseline, or exhausted retry.

## Verification
Reviewer separate from optimizer signs off.

## Definition of Done
Measured reduction in targeted token/context metric with equal-or-better required quality and no critical context loss.
