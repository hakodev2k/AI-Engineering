# Skill — Fan-out Cost Analysis

## Purpose
Determine whether a proposed multi-agent decomposition is likely to reduce total tokens/cost/latency or merely multiply fixed context overhead.

## Trigger
Before spawning multiple subagents, after a framework/model/context change, or when usage rises unexpectedly during orchestration.

## Inputs
Measured child bootstrap tokens, inherited context estimate, expected unique work per child, serial baseline, polling cadence, synthesis cost, price/usage semantics, quality requirements.

## Preconditions
At least one representative local baseline or a conservative estimate clearly labeled as such.

## Required context
Task decomposition, required child context, available telemetry and acceptance criteria.

## Allowed tools
Provider usage telemetry, trace parser, test runner, `scripts/fanout_budgeter.py`.

## Constraints
Do not remove correctness-critical context. Do not treat cached tokens as free unless the actual provider/account semantics prove that assumption.

## Procedure
1. Measure one minimal child startup on the current configuration.
2. Separate fixed/bootstrap context from unique task context.
3. Estimate inherited parent context and orchestration/status turns.
4. Estimate the serial alternative using the same acceptance criteria.
5. Run the budgeter before spawning.
6. If blocked, regroup related tasks, narrow child tool/skill surfaces, reduce inherited history, or serialize.
7. Execute the chosen plan.
8. Record actual tokens, latency and result quality; compare prediction error and update the baseline.

## Decision points
Fan-out is rejected when configured token budget/ratio thresholds fail. If latency is a hard requirement, an owner may accept higher token cost explicitly, but the tradeoff must be recorded.

## Expected output
Predicted fan-out/serial tokens, overhead share, recommendation, assumptions, actual after-run metrics and quality verification.

## Metrics
Tokens/task, cost/task, wall-clock latency, child bootstrap tokens, inherited tokens, polling tokens, context utilization, result quality, regression rate, prediction error.

## Verification
Run the same acceptance/quality checks for the fan-out and serial/baseline path; do not claim savings without measured after-run telemetry.

## Failure handling
Maximum 2 tuning attempts. If telemetry is unavailable, use a conservative cap and report the estimate as unverified rather than claiming optimization.

## Stop conditions
Budget exceeded, quality regression, required context would need removal, or retry budget exhausted.
