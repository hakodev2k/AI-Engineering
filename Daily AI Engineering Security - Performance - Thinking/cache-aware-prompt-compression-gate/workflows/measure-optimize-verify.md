# Workflow — Measure, Optimize, Verify

## Trigger
Any change to compression, prompt ordering, caching strategy, model/provider, tool schemas, or retrieved-context policy.

## Goal
Improve effective prompt cost and/or latency while preserving required context and quality.

## Inputs
Segment map, baseline benchmark, candidate generator/strategy, policy, provider usage records.

## Baseline
Capture per-case input tokens, cached tokens, cache-write tokens when available, TTFT, total latency, quality score, and critical-context status before optimization.

## Stages
1. **Observe** — identify stable, dynamic, and protected segments.
2. **Measure baseline** — run benchmark set and aggregate metrics.
3. **Diagnose** — locate volatile prefix breakers, duplicated context, low-value dynamic material, and expensive uncached prefixes.
4. **Hypothesize** — state one measurable change, such as moving volatility after the stable prefix or compressing a dynamic retrieval section.
5. **Implement candidate** — change only the stated variables.
6. **Measure again** — run the identical benchmark.
7. **Gate** — execute `scripts/cache_compression_gate.py`.
8. **Verify** — Benchmark Verifier reruns the candidate independently.
9. **Complete** — record accepted strategy and evidence.

## Responsible agent
Optimization owner implements; `subagents/benchmark-verifier.md` independently verifies.

## Tools
Provider usage logs, benchmark harness, quality evaluator, deterministic gate script.

## Outputs
Baseline JSON, candidate JSON, gate result, verifier result, accepted/rejected strategy.

## Checkpoints
- Baseline complete before changes.
- Protected segment coverage checked before candidate run.
- Same benchmark cases confirmed before comparison.
- Independent verifier completes before acceptance.

## Metrics
Effective cost/task, cache-hit ratio, cached tokens, cache writes, TTFT, total latency, quality regression, critical-context failures.

## Retry policy
At most `max_candidates` candidate strategies. Each retry MUST change a documented hypothesis rather than repeat the same candidate.

## Stop conditions
Stop on verified acceptance, exhausted candidate budget, missing blocking evidence, or any unresolved critical-context failure.

## Failure path
If no candidate passes, keep the baseline and record why candidates failed. Do not weaken correctness thresholds.

## Verification
Passing the deterministic gate is necessary but not sufficient; independent rerun is required.

## Definition of Done
Baseline captured; limitations identified; candidate measured; all blocking thresholds pass; verifier confirms results; no critical context was lost.