# Workflow: Diagnose and Tune

## Trigger
False loop termination, redundant verification, or unattended non-convergence.

## Goal
Identify the exact state/freshness failure and correct it with bounded changes.

## Inputs
Telemetry trace, task lifecycle, state fingerprint, verification outputs.

## Baseline
Record loop-stop count, verification count, wall time, tool calls, and final task status before changes.

## Stages
1. **Observe:** collect the failing trace without changing thresholds.
2. **Measure:** calculate state transitions and verification-to-state bindings.
3. **Diagnose:** classify false positive, stagnant loop, stale verification, or scope expansion.
4. **Hypothesize:** state one observable cause and expected metric change.
5. **Implement:** change state binding or the smallest relevant budget.
6. **Measure again:** replay baseline fixtures and a fresh real trace.
7. **Verify:** independent reviewer checks both allow and stop cases.

## Responsible agent
Implementation agent performs steps 1–6; Verification Loop Reviewer performs step 7.

## Tools
Trace collector, `scripts/progress_loop_guard.py`, unit tests.

## Outputs
Before/after metrics, reason-coded controller result, reviewer decision.

## Checkpoints
After baseline, after hypothesis, before rollout.

## Metrics
False-stop rate, redundant verification count, stagnant-repeat limit, task completion rate.

## Retry policy
Maximum 2 hypothesis revisions.

## Stop conditions
Terminal task state, missing deterministic state evidence, or exhausted retries.

## Failure path
Restore previous loop policy and require human review; do not disable loop protection.

## Verification
Must pass executable tests plus independent trace review.

## Definition of Done
Baseline captured, root cause demonstrated, change measured, no required verification weakened, reviewer passes.
