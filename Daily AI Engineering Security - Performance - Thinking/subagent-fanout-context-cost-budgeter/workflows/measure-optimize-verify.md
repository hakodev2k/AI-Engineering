# Workflow — Measure, Optimize, Verify

## Trigger
A task is proposed for parallel subagent fan-out or an existing multi-agent task shows high token/usage growth.

## Goal
Choose a decomposition that meets correctness and latency requirements with bounded token/cost overhead.

## Inputs
Task set, child configuration, baseline traces, required context, provider usage data, acceptance tests.

## Baseline
Measure serial tokens/task and one representative child bootstrap. Record parent context, inherited child context, tool/skill schema size, polling behavior and wall-clock latency.

## Stages
1. **Observe:** inspect current decomposition and telemetry.
2. **Measure baseline:** capture serial and child-startup metrics.
3. **Diagnose:** separate fixed overhead, inherited context, unique work, polling and synthesis.
4. **Hypothesize:** predict whether grouping, narrower context, fewer children or lower polling will reduce tokens without quality loss.
5. **Optimize:** apply one bounded change.
6. **Measure again:** record actual tokens/cost/latency and prediction error.
7. **Improved?** If no, re-evaluate once; if yes, run quality/regression verification.

## Responsible agent
Token Optimizer recommends; coordinator executes; independent benchmark/review owner verifies quality when risk warrants it.

## Tools
Provider telemetry, trace inspection, `scripts/fanout_budgeter.py`, project tests/benchmarks.

## Outputs
Before/after metrics, chosen orchestration shape, prediction error, result-quality evidence.

## Checkpoints
Before spawn; after first measured run; before accepting a lower-context configuration.

## Metrics
Tokens/task, cost/task, latency, bootstrap/inherited/polling tokens, context utilization, result quality, regression rate.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Budget exceeded, quality regression, required context would be removed, or retry budget exhausted.

## Failure path
Revert to the last verified orchestration shape; record measured cause and remaining cost.

## Verification
Optimization is accepted only when before/after telemetry exists and acceptance tests show no critical quality loss.

## Definition of Done
Measured baseline, bounded change, after-run metrics, quality verification, and no unbounded polling/fan-out remain.
