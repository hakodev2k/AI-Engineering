# Workflow: Regression Verification

## Trigger
Any change to loop detection, retry logic, progress markers, budgets, or terminal-state handling.

## Goal
Prove the runtime stops zero-progress loops while preserving legitimate recovery.

## Inputs
Policy, guard, tests, representative traces, before metrics.

## Baseline
Known transient-recovery fixture, known repeated-equivalent failure fixture, and budget-exhaustion fixture.

## Stages
1. Run `python -m unittest tests/test_progress_loop_guard.py`.
2. Replay a transient failure followed by new durable progress; expect continuation.
3. Replay repeated equivalent failures with only volatile argument changes; expect terminal checkpoint at policy threshold.
4. Replay token/turn/wall budget exhaustion; expect terminal checkpoint regardless of model preference.
5. Verify the runtime does not schedule another model turn after terminal state.
6. Compare tokens/time and false-stop metrics with baseline.
7. Obtain independent verifier decision.

## Checkpoints
Deterministic tests before runtime replay; terminal-state inspection before metric sign-off.

## Metrics
Stop latency after first equivalent repeat, false-stop rate, runaway-tail tokens/time, successful recovery rate.

## Retry policy
One corrective patch and one complete rerun.

## Stop conditions
Any post-terminal model turn, unbounded retry path, hidden-reasoning dependency, or unexplained false-stop blocks completion.

## Failure path
Disable autonomous continuation for the affected workflow and restore the last verified policy/runtime behavior.

## Verification
Verifier must be distinct from implementation owner.

## Definition of Done
Implemented, measured, and independently verified; all deterministic tests pass and no blocking runaway or false-stop regression remains.
