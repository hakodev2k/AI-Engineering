# Workflow: Regression Verification

## Trigger
Any change to loop detection, retry budgets, verification freshness, or task-state lifecycle.

## Goal
Prove convergence behavior remains bounded and progress-aware.

## Inputs
Controller, test fixtures, baseline metrics.

## Baseline
Known productive cycle, stagnant cycle, redundant-verification cycle, and terminal-state case.

## Stages
1. Run unit tests.
2. Replay productive cycle and require `continue`.
3. Replay stagnant cycle and require bounded stop.
4. Replay repeated fresh-green verification on unchanged state and require bounded stop.
5. Change state after a green verification and confirm prior verification is not reused as proof for the new state.
6. Review reason codes and metrics.

## Responsible agent
Test agent executes; Verification Loop Reviewer independently signs off.

## Tools
Python unittest and controller script.

## Outputs
Test log, before/after counters, verification decision.

## Checkpoints
After fixture run and before release.

## Metrics
Pass/fail by fixture, stop iteration, verification count.

## Retry policy
One implementation correction followed by one complete rerun.

## Stop conditions
Any unbounded loop, false stop on advancing state, or reuse of stale verification blocks completion.

## Failure path
Revert control change and escalate.

## Verification
Independent reviewer must not be the implementing agent.

## Definition of Done
All fixtures pass and no blocking regression remains.
