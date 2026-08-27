# Skill: GPT-5.6 Cache Efficiency Analysis

## Purpose
Determine whether an agent workload is benefiting from prompt caching or repeatedly paying to write changing prefixes.

## Trigger
Migration to GPT-5.6-family models; unexplained input-cost/latency increase; low cache reads; high cache writes; prompt/tool-schema changes; compaction changes.

## Inputs
Per-request `input_tokens`, `cached_tokens`, `cache_write_tokens`, logical `workload_id`, `prompt_cache_key`, and a hash/fingerprint of the intended stable prefix.

## Preconditions
Usage fields must come from provider responses or equivalent trusted telemetry. Prefix fingerprints must be computed locally without storing sensitive prompt text.

## Required context
Model/version, prompt assembly order, tool/schema order, cache policy/mode, intended stable prefix, request routing strategy.

## Allowed tools
Read-only telemetry queries, local hashing/profiling, `scripts/cache_write_guard.py`, provider usage dashboards.

## Constraints
MUST NOT remove correctness-critical context merely to improve cache metrics. MUST NOT infer savings without before/after measurements.

## Procedure
1. Capture a baseline of at least the configured minimum requests per workload.
2. Record stable-prefix fingerprints and cache keys.
3. Run the guard and identify write/read amplification, zero-read frequency, and key/prefix instability.
4. Inspect prompt assembly for dynamic values before the intended breakpoint and regenerated/reordered tool schemas.
5. Form one explicit hypothesis for the dominant cache miss source.
6. Apply one change: explicit breakpoint, explicit caching mode, stable key, stable tool/schema ordering, or move dynamic fields after the breakpoint.
7. Re-measure the same workload shape.
8. Compare tokens/task, cache write/read ratio, latency, cost, and result-quality regressions.

## Decision points
Prefer explicit breakpoints when stable content is large and dynamic suffixes are expected. Preserve context when cache savings conflict with correctness.

## Expected output
Baseline, identified churn source, change applied, before/after metrics, risks, verification status.

## Metrics
Input tokens/task, cached tokens/task, cache-write tokens/task, write/read ratio, zero-read fraction, latency/task, cost/task, result-quality/regression rate.

## Verification
Independent benchmark or reviewer confirms the improvement on equivalent workload samples.

## Failure handling
Detection: policy block or no measurable improvement. Retry: maximum 2 hypotheses. Fallback: retain known-correct prompt structure even if cache efficiency remains lower. Escalate provider/integration ambiguity. Stop after bounded retries or any quality regression that cannot be explained.
