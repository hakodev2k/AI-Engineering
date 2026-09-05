# Workflow: Measure, Optimize, Verify

## Trigger
Premature/late compaction or context-cost regression.

## Goal
Correct compaction timing and reduce unnecessary token/cost/latency without degrading task quality.

## Inputs
Representative traces, model metadata, token usage, current config.

## Baseline
Record tokens/task, compactions/task, utilization at each compaction, summary tokens, latency, cost, success/quality.

## Stages
1. Observe and reproduce.
2. Measure baseline.
3. Diagnose capacity and accounting semantics.
4. Form one testable hypothesis.
5. Implement the smallest correction.
6. Replay identical workload.
7. If improved, run boundary/regression tests and independent review.
8. If not improved, re-evaluate once; a second failed candidate triggers fallback.

## Responsible agent
Context analyst for stages 1-7; independent Context Budget Reviewer for final verification.

## Tools
Usage logs, model docs, `scripts/context_budget_guard.py`, unit tests, workload benchmark.

## Outputs
Baseline/candidate metrics, hypothesis evidence, implementation, reviewer decision.

## Checkpoints
Capacity validated before threshold changes; quality checked before accepting token savings.

## Metrics
Tokens/task, cost/task, latency/task, utilization at compaction, compactions/task, quality, critical-context-loss count.

## Retry policy
Maximum 2 candidate implementations.

## Stop conditions
Unknown capacity, quality regression beyond tolerance, critical context loss, or two unsuccessful candidates.

## Failure path
Restore known-safe configuration and escalate with evidence.

## Verification
Independent arithmetic calculation plus trace replay and boundary tests.

## Definition of Done
Compaction timing matches configured policy within measurement tolerance and before/after metrics show no critical quality regression.