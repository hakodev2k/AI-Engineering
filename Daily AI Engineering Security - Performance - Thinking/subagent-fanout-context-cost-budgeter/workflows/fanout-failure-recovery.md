# Workflow — Fan-out Failure Recovery

## Trigger
Actual token usage exceeds the pre-spawn estimate/budget, polling becomes repetitive, a child inherits unexpectedly large context, or quality regresses after context narrowing.

## Goal
Stop amplification and return to a verified orchestration shape without sacrificing required context or correctness.

## Inputs
Predicted budget, actual usage, child roster/status, traces, acceptance results, last verified plan.

## Baseline
Record last verified token/cost/latency and the current number of active children/polls.

## Stages
1. Detect the dominant excess: bootstrap, inherited context, polling, synthesis, or unexpected retries.
2. Stop spawning new children.
3. Bound remaining status checks; prefer event/result collection over repeated model turns where possible.
4. Preserve completed child outputs without repeatedly reinjecting full histories.
5. Regroup pending tiny tasks or serialize them.
6. Restore any context removed by an optimization that caused a correctness regression.
7. Re-measure one recovery run.

## Retry policy
One recovery run after the initial failure; no autonomous repeated fan-out tuning.

## Stop conditions
Budget is stable and quality passes, or owner intervention/platform change is required.

## Failure path
Return to the last verified serial/grouped plan and report measured excess rather than weakening quality checks.

## Verification
Compare recovery run against baseline for tokens, latency and acceptance criteria.

## Definition of Done
No runaway spawning/polling remains, quality is restored, and actual usage is measured.
