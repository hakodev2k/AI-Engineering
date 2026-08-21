# Workflow: Profile → Optimize → Verify

## Trigger
Low prompt-cache reuse, uncached-input cost growth, TTFT regression, or a structural change to system/tool/RAG context.

## Goal
Increase reusable exact-prefix stability while preserving required context and task quality.

## Inputs
Baseline and candidate request samples, ordered prompt segments, cached/input token telemetry, latency/cost metrics, quality outcomes, thresholds.

## Baseline
Capture at least `minimum_comparable_samples` from one workload class before changing layout. Record mean cached ratio, latency, cost when available, success/quality rate, and stable-segment hash variants.

## Stages
1. **Observe** — capture the actual rendered request, not only prompt templates.
2. **Measure baseline** — run `scripts/cache_profiler.py` on baseline samples.
3. **Diagnose** — locate earliest divergent segment and expected-stable segments with multiple hashes.
4. **Hypothesize** — choose one cause: volatile field placement, nondeterministic ordering, query-specific compression, tool/schema churn, or unnecessary dynamic metadata.
5. **Optimize** — move volatility after reusable content or canonicalize stable serialization; keep correctness/security context.
6. **Measure again** — collect a comparable candidate cohort and rerun profiler.
7. **Compare** — evaluate cached/input ratio, latency, cost, and quality.
8. **Verify independently** — `subagents/cache-verifier.md` checks thresholds and layout.

## Responsible agent
Optimization owner for stages 1–7; Cache Verifier for stage 8.

## Tools
Provider telemetry, repository inspection, `scripts/cache_profiler.py`, workload/eval harness.

## Outputs
Baseline report, first-divergence/root-cause evidence, candidate report, before/after metrics, verifier decision.

## Checkpoints
- Cohort equivalence documented.
- Actual rendered segment order captured.
- Quality metric selected before optimization.
- Required context diff reviewed before candidate rollout.

## Metrics
Cached/input token ratio; earliest divergence; stable-segment hash variants; cost/task; latency/task; success/quality regression rate.

## Retry policy
Maximum 3 diagnose/change/measure cycles. A retry must address a new measured cause rather than repeat the same rearrangement.

## Stop conditions
Three unsuccessful cycles; missing required quality evidence; provider telemetry insufficient to distinguish cache reuse; improvement requires removing critical context.

## Failure path
Revert the candidate when quality exceeds the regression threshold. Preserve baseline/candidate evidence and escalate architecture/provider limitations.

## Verification
Independent verifier confirms comparable sampling, thresholds, stable serialization, and unchanged required context.

## Definition of Done
Baseline measured; first divergence/root cause documented; candidate implemented; cache telemetry improves meaningfully; latency/cost do not materially regress; quality is within policy; required context remains; independent verifier returns `verified`.