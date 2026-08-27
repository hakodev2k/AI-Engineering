# Workflow: Cache Regression Verification

## Trigger
Prompt, tool/schema, model, cache-key, compaction, or routing changes.

## Goal
Detect regressions in cache efficiency and task quality before release.

## Inputs
Last verified baseline trace, candidate trace, policy, quality benchmark results.

## Baseline
Use a workload-matched previously verified trace. If unavailable, establish a fresh baseline before optimization claims.

## Stages
1. Run `python -m unittest tests/test_cache_write_guard.py`.
2. Run the guard on baseline and candidate traces.
3. Compare input tokens, cached tokens, cache-write tokens, write/read ratio, zero-read fraction, latency/cost when available.
4. Confirm `prompt_cache_key` and stable-prefix fingerprint behavior matches design.
5. Run task-quality/regression tests.
6. Allow one corrective change and one rerun if the candidate fails.
7. Independent verifier reviews equivalence and results.

## Outputs
Before/after metric table, guard results, quality result, verification decision.

## Metrics
Tokens/task, cache write/read ratio, zero-read fraction, latency/task, cost/task, quality/regression rate.

## Retry policy
Maximum 1 correction cycle in this verification workflow.

## Stop conditions
Critical quality loss, missing required telemetry, non-equivalent workloads, or unresolved cache-write amplification blocks completion.

## Failure path
Hold release and retain the last verified prompt/cache structure.

## Verification
Reviewer must be independent from the implementer for production cache-policy changes.

## Definition of Done
Tests pass, equivalent traces are measured, target cache metrics do not regress beyond policy, and quality remains acceptable.
