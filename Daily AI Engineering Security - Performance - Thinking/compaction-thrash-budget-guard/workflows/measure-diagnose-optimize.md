# Workflow: Measure, Diagnose, Optimize

**Trigger:** repeated compaction, cache-write spikes, premature compaction, or post-compaction context refill.  
**Goal:** reduce token/latency waste while preserving correctness-critical context.

## Inputs
Representative trace, policy, runtime configuration, task acceptance criteria.

## Baseline
Record tokens/task, compaction frequency, minimum gap, cache ratios, repeated-static tokens, p95 input tokens, progress events and result quality.

## Context
Preserve requirements, safety constraints, unresolved evidence and live task state.

## Stages
1. **Observe** — collect a trace without optimization.
2. **Measure** — run `compaction_guard.py` and save baseline metrics.
3. **Diagnose** — map violations to static reload, usage-accounting, cache, or retry behavior.
4. **Hypothesize** — choose one falsifiable root cause.
5. **Optimize** — make one change only.
6. **Measure again** — replay equivalent workload.
7. **Improved?** If no, revert/re-evaluate; maximum 2 attempts. If yes, continue.
8. **Verify** — independent verifier checks quality, state retention and metrics.

## Responsible agent
Implementation owner performs stages 1–7; Token Performance Verifier performs stage 8.

## Tools
Telemetry collector, guard script, unit tests, runtime cache/token metrics.

## Outputs
Baseline JSON, diagnosis, hypothesis, after JSON, comparison, verification decision.

## Checkpoints
After baseline, before context removal, after each benchmark, before completion.

## Metrics
All metrics listed in README plus any runtime-specific cost/task metric.

## Retry policy
Maximum 2 optimization attempts; revert failed changes before the next hypothesis.

## Stop conditions
Stop on missing telemetry, lost critical context, quality/security regression, or repeated `stop-and-recover` decision.

## Failure path
Restore last verified configuration; transfer state to a fresh session if required; file/runtime escalation with trace evidence.

## Verification
Independent verifier must reproduce the comparison.

## Definition of Done
Measured improvement, passing tests, no critical context loss, bounded loops, verification complete.