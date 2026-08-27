# Workflow: Measure, Optimize, Verify Prompt Cache

## Trigger
GPT-5.6 migration, high cache-write volume, low cache reuse, or cache-related latency/cost regression.

## Goal
Reduce cache write amplification while preserving or improving result quality.

## Inputs
Request trace, prompt assembly, tool/schema definitions, cache policy, representative quality tests.

## Baseline
Collect at least the configured minimum equivalent requests with input/read/write token metrics, cache keys, prefix fingerprints, latency, and task outcome.

## Stages
1. **Observe:** inspect current prompt assembly and telemetry.
2. **Measure baseline:** run `scripts/cache_write_guard.py`.
3. **Diagnose:** identify unstable prefix/key, dynamic-before-breakpoint content, tool/schema churn, or compaction rewrite.
4. **Form hypothesis:** choose one dominant source.
5. **Implement improvement:** use an explicit breakpoint/mode, stabilize key/schema order, or move volatile fields after the stable prefix when correctness permits.
6. **Measure again:** capture equivalent request samples.
7. **Improved?** Compare write/read ratio, zero-read fraction, tokens/task, latency and cost. If not, revise once; maximum 2 hypotheses total.
8. **Verify:** run quality/regression tests and independent Cache Benchmark Verifier review.

## Responsible agent
Implementation owner performs stages 1–7; independent verifier performs stage 8.

## Tools
Provider telemetry, local fingerprinting, cache guard, application benchmark/tests.

## Outputs
Baseline trace/result, hypothesis, implementation diff, optimized trace/result, quality evidence, verifier decision.

## Checkpoints
After baseline; before altering required context; after optimized measurement; before completion.

## Metrics
Input tokens/task, cached tokens/task, cache-write tokens/task, write/read ratio, zero-read fraction, latency/task, cost/task, quality/regression rate.

## Retry policy
Maximum 2 optimization hypotheses. Do not repeatedly mutate prompts without measurement.

## Stop conditions
Stop on critical quality regression, missing telemetry, non-equivalent workloads, exhausted retries, or provider behavior that cannot be measured reliably.

## Failure path
Restore the last known-correct prompt structure; document unresolved cache inefficiency and escalate.

## Verification
Independent reviewer must reproduce metric calculations and confirm quality evidence.

## Definition of Done
Implemented: cache-structure change is deployed in the test environment. Measured: equivalent before/after telemetry exists. Verified: target metrics improve without critical context or quality loss.
