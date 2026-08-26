# Workflow: Token Regression Verification

## Trigger
Any change to polling cadence, subagent lifecycle, context compaction, prompt-cache handling, or tool-output retention.

## Goal
Verify savings persist and task quality is not reduced.

## Inputs
Baseline trace, candidate trace, policy, acceptance results and profiler outputs.

## Baseline
Use the last verified equivalent workload.

## Stages
1. Run unit tests.
2. Profile baseline and candidate traces.
3. Compare tokens/task and no-change cached tokens.
4. Compare wait-family turn count and duplicate-output count.
5. Verify every meaningful state transition still reaches the model/orchestrator.
6. Verify task acceptance and required tests are unchanged or better.
7. Inspect lifecycle termination evidence for false-stale classification.

## Outputs
Before/after table, quality checks, violations and pass/block decision.

## Checkpoints
After deterministic tests and after task-quality comparison.

## Metrics
Candidate MUST reduce at least one target metric without increasing task regression rate; no critical context-loss event is allowed.

## Retry policy
One corrective implementation and one complete rerun; otherwise escalate.

## Stop conditions
Missed state change, task failure, unbounded polling, or context-loss evidence blocks completion.

## Failure path
Revert to last verified policy and retain the failed trace for diagnosis.

## Verification
Independent Token Verifier signs off.

## Definition of Done
Measured savings, equivalent quality, bounded loops, tests passing, and no blocking regression.
