# Workflow: Measure Optimize Verify

## Trigger
Performance complaint or change in history/render/reactive-state hot path.

## Goal
Reduce measured work amplification while preserving behavior.

## Inputs
Representative JSONL telemetry, budget, source change, correctness suite.

## Baseline
Run profiler before code changes and archive metric output.

## Stages
1. Observe symptoms and capture workload.
2. Measure baseline.
3. Diagnose highest clone/wakeup amplification.
4. Form one hypothesis.
5. Implement minimal optimization.
6. Replay identical workload and measure again.
7. If not improved, re-evaluate once; maximum two attempts.
8. Run correctness/event-order tests.
9. Independent benchmark verification.

## Checkpoints
Baseline recorded; candidate metrics recorded; correctness passed; independent verification passed.

## Metrics
Clone bytes/event, redundant wakeup ratio, p95 duration, amplification ratio, behavior failures.

## Retry policy
At most two optimize/retest cycles. Then stop and return to diagnosis with evidence.

## Stop conditions
Pass when budgets improve/pass and behavior is unchanged. Stop if workload equivalence cannot be established or optimization requires unsafe semantics.

## Failure path
Revert candidate optimization, preserve metrics, and escalate root-cause investigation.

## Verification
`python -m unittest tests/test_hotpath_profiler.py` and identical before/after replay.

## Definition of Done
Implemented, measured, independently verified, and no blocking regression remains.