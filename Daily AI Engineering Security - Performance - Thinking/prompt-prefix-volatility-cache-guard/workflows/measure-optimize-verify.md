# Workflow: Measure, Optimize, Verify

**Trigger:** cache miss/churn regression or prompt-builder change.  
**Goal:** reduce token/cost/latency waste while preserving correctness.

## Inputs
Comparable request traces, prompt-segment manifests, actual cache usage, quality tests.

## Baseline
Record input tokens/task, cache-read tokens/task, cache-creation tokens/task, latency, cost, and quality pass rate.

## Stages
1. **Observe:** capture two comparable prompt builds.
2. **Measure baseline:** record cache metrics.
3. **Diagnose:** find first changed segment and blast radius.
4. **Form hypothesis:** identify one volatile segment and safe relocation/isolation mechanism.
5. **Optimize:** change only that mechanism.
6. **Measure again:** rerun comparable workload.
7. **Improved?** If no, revert or attempt one alternative; maximum 2 experiments.
8. **Verify:** independent verifier checks cache and quality evidence.

## Checkpoints
Before prompt relocation; after first measurement; before accepting any required-context exemption.

## Metrics
Cache hit ratio, cache-read/write tokens, blast-radius tokens, latency/task, cost/task, quality regression rate.

## Retry policy
Maximum 2 experiments for one volatility source.

## Stop conditions
Stop if required context is lost, quality regresses beyond accepted tolerance, cache telemetry is insufficient, or retries are exhausted.

## Failure path
Revert layout change and document the required volatile segment as an explicit measured exemption.

## Verification
Unit tests for the profiler plus representative before/after provider telemetry.

## Definition of Done
Baseline captured, root volatility identified, change implemented, before/after metrics collected, quality tests pass, independent verification complete.
