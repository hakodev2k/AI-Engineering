# Workflow: Observe Progress and Recover

## Trigger
Every autonomous continuation, retry, review cycle, or long-running checkpoint.

## Goal
Continue only while measurable goal progress exists; stop before a no-progress loop becomes expensive.

## Inputs
Active goal, criteria, events, hypothesis ID, blocker set, token/time counters.

## Baseline
Record current deliverable state, unsatisfied criteria, blocker count, and latest verified test/evidence state.

## Context
Latest user instructions and corrections, dependencies, verification requirements, remaining retry budget.

## Stages
1. **Observe** — capture before-state.
2. **Execute bounded step** — perform one coherent implementation/investigation stage.
3. **Measure** — emit machine-readable progress events.
4. **Verify** — Liveness Verifier checks whether events are new and goal-relevant.
5. **Decision** — score >0 continues; zero score increments stagnation.
6. **Recover** — after two zero-progress iterations require a changed hypothesis or explicit blocker.
7. **Stop** — at three zero-progress iterations halt autonomous continuation.
8. **Complete** — only when every required criterion is verified.

## Responsible agent
Execution agent performs work; Liveness Verifier independently scores progress.

## Tools
Diff/test/evidence readers, `scripts/liveness_gate.py`, normal implementation tools subject to existing permissions.

## Outputs
Progress decision JSON, updated streak, next hypothesis requirement, blocker evidence, final verification state.

## Checkpoints
After every autonomous iteration and immediately before final completion.

## Metrics
Progress score, no-progress streak, tokens/criterion, acceptance coverage, repeated-hypothesis attempts, recovery success rate.

## Retry policy
Maximum 3 consecutive zero-progress iterations. After iteration 2, retry is permitted only with a changed hypothesis or new evidence.

## Stop conditions
Three zero-progress iterations, unchanged failed hypothesis, missing measurable criteria, or blocker requiring human action.

## Failure path
Preserve the last verified state, report facts/evidence/blocker, and request human direction without fabricating completion.

## Verification
Re-run required tests/acceptance checks and ensure the final criteria ledger contains no false or unknown mandatory item.

## Definition of Done
Goal preserved, all mandatory criteria verified, no unbounded loop occurred, progress metrics captured, and independent verifier approves completion.