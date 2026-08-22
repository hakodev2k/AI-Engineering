# Workflow: Offload and Verify

## Trigger
A task/process/child agent is expected to run longer than one ordinary tool turn and exposes a durable status handle.

## Goal
Remove quiet waiting from the model inference path while preserving completion correctness, cancellation, deadlines, and observability.

## Inputs
Handle, provider adapter, policy, baseline telemetry, expected terminal states.

## Baseline
Measure model wait turns, wait tokens, poll cadence, completion-detection lag, and terminal-state correctness on at least 3 representative runs.

## Stages
1. **Observe** — classify the current wait path and collect baseline traces.
2. **Diagnose** — confirm repeated model turns are used only for status/wait decisions.
3. **Hypothesis** — runtime-side polling/event completion will reduce model work without unacceptable detection lag.
4. **Implement** — route pending jobs to `scripts/wait_broker.py` or a push completion adapter.
5. **Measure again** — run identical fixtures.
6. **Independent verification** — Wait Benchmark Agent checks metrics and terminal-state parity.
7. **Rollout** — enable only when correctness gates pass.

## Responsible agent
Implementation owner for integration; Wait Benchmark Agent for independent verification.

## Tools
Broker script, provider adapter, task telemetry, deterministic tests.

## Outputs
Before/after benchmark, terminal event, policy, verification decision.

## Checkpoints
- durable handle valid
- status lookup read-only
- deadline configured
- completion/cancel/timeout fixtures pass
- >=80% model wait-turn reduction on long-running fixtures

## Retry policy
At most one integration retry after a failed verification cycle. Provider transient errors may be retried only within the configured broker poll budget.

## Stop conditions
Security regression, incorrect terminal state, cancellation failure, false timeout, exhausted retry budget, or no measurable reduction.

## Failure path
Disable offload for the affected provider and fall back to the prior bounded wait mechanism; preserve telemetry and root-cause evidence.

## Definition of Done
Implemented, measured, and independently verified; no terminal-state regression; metrics stored; failure and rollback paths documented.
