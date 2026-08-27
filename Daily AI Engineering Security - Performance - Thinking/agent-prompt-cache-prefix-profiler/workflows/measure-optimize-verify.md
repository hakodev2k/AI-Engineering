# Workflow: Measure → Optimize → Verify

## Trigger
Measured token/cost/cache regression or planned prompt/tool change.

## Goal
Reduce static-prefix replay and improve cache reuse without correctness loss.

## Inputs
Representative tasks, baseline trace, prompt/tool configuration, thresholds.

## Baseline
Run profiler on unchanged workload and record tokens/task, read/create ratios, replay tokens, latency and quality pass rate.

## Stages
1. Observe baseline metrics and mutation events.
2. Diagnose the highest measured replay source.
3. Form one hypothesis: deterministic tool ordering, stable tool set, later dynamic context, closer breakpoint, or reduced duplicate static context.
4. Implement exactly one relevant change.
5. Re-run the same workload.
6. Compare before/after with the profiler and thresholds.
7. If not improved, revert and form at most one additional hypothesis.
8. If improved, hand traces to independent Cache Benchmark Reviewer.

## Responsible agents
Optimizer implements; Cache Benchmark Reviewer verifies.

## Tools
Profiler, request traces, prompt serializer inspection, quality tests.

## Outputs
Before/after metrics, mutation evidence, accepted/rejected hypothesis, verification result.

## Checkpoints
After baseline, before implementation, after comparison, after independent review.

## Metrics
Input tokens/task, cache-read/create ratios, replay tokens/task, p50/p95 latency, quality pass rate.

## Retry policy
Maximum 2 optimization hypotheses per investigation.

## Stop conditions
Quality threshold failure, non-comparable workload, no measured hotspot, or two rejected hypotheses.

## Failure path
Restore baseline configuration and document the rejected hypothesis.

## Verification
Independent reviewer must pass measured thresholds.

## Definition of Done
Baseline captured, hotspot evidenced, change implemented, after trace captured, replay reduced, thresholds passed, risks documented, independent verification complete.
