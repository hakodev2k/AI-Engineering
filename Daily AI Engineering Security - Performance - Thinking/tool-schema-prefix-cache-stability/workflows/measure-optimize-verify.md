# Workflow: Measure → Optimize → Verify

## Trigger
Prompt/tool-cache efficiency regression or a change to tool discovery/serialization.

## Goal
Lower uncached input tokens and latency without reducing correctness.

## Inputs
Representative trace corpus, budget, implementation diff, quality suite.

## Baseline
Run `context_cache_analyzer.py` on the unmodified system and archive the report.

## Stages
1. **Observe** — collect equivalent workload traces.
2. **Measure baseline** — cache ratio, uncached tokens, schema bytes, order drift, TTFT/latency, quality.
3. **Diagnose** — identify the strongest measured instability.
4. **Form hypothesis** — state one change and predicted metric effect.
5. **Implement** — stabilize ordering/serialization or placement; do not remove required context.
6. **Measure again** — rerun the same workload.
7. **Compare** — require improvement in the targeted metric and no quality-budget violation.
8. **Verify** — independent Verification Agent reproduces results.

## Responsible agent
Cache Investigator for stages 1–7; Verification Agent for stage 8.

## Tools
Analyzer script, unit/regression tests, provider telemetry, read-only diff tools.

## Outputs
Baseline report, optimized report, metric delta, quality result, verification decision.

## Checkpoints
After baseline, after hypothesis, after optimized measurement, after independent verification.

## Metrics
Cache hit ratio, uncached tokens/task, schema bytes/request, order drift, TTFT p95, latency p95, quality pass rate.

## Retry policy
At most 2 optimization retries. Each retry must update the hypothesis with new evidence.

## Stop conditions
Stop on quality regression, missing required tool/context, non-comparable workload, missing telemetry, or exhausted retries.

## Failure path
Restore last known-good prompt/tool assembly and preserve reports for escalation.

## Verification
Independent rerun plus inspection that tool/context coverage has not weakened.

## Definition of Done
Measured improvement, budget pass, tests pass, quality preserved and independent verification complete.
