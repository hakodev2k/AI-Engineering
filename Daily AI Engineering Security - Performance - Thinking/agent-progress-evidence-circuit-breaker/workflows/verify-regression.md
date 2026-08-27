# Workflow: Regression Verification

## Trigger
Any change to continuation scheduling, loop-control policy, task-state handling, or progress classification.

## Goal
Prove the change stops known no-progress loops without breaking productive long-running tasks.

## Inputs
Unit fixtures, captured event ledgers, policy, implementation diff.

## Baseline
Record previous stop/continue decisions and task outcomes for the same fixtures.

## Stages
1. Run unit tests.
2. Replay a productive multi-step ledger and require `continue` until terminal completion.
3. Replay acknowledgement-only continuation and require a bounded `stop`.
4. Replay three identical tool calls and require a bounded `stop`.
5. Replay a persisted paused/blocked state and require immediate `stop`.
6. Compare tokens/turns spent before the stop where telemetry is available.
7. Independent verifier reviews any changed thresholds.

## Checkpoints
After test pass, after stuck-ledger replay, before release.

## Metrics
Fixture pass rate, turns-to-stop, false-stop count, terminal-state continuation count.

## Retry policy
One implementation correction followed by one full rerun. A second failure blocks release.

## Stop conditions
Any terminal-state continuation, unbounded retry path, missing progress evidence, or test failure after retry.

## Failure path
Keep previous behavior or disable automatic continuation for the affected path; escalate with evidence.

## Verification
Verifier must be separate from the implementer for production-impacting changes.

## Definition of Done
All deterministic fixtures pass, productive fixtures remain productive, stuck fixtures stop within configured bounds, and verification evidence is recorded.
