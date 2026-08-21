# Skill: Cache Baseline and Diagnosis

## Purpose
Measure whether repeated agent work is actually reusing prompt-prefix computation and identify which supposedly stable prefix sections change.

## Trigger
Use when input-token cost, latency, or cache-write volume is high, or before changing prompt/tool layout for caching.

## Inputs
Representative request traces, stable-prefix section map, provider usage metrics, quality/evaluation result, and `config/cache-policy.json`.

## Preconditions
Use representative tasks and the same model/service tier when comparing variants. Redact secrets before trace capture.

## Required context
Know which content is semantically order-sensitive and which sections are required for correctness/security.

## Allowed tools
Provider usage telemetry, deterministic trace exporters, `scripts/prefix_stability.py`, existing evaluation/benchmark suites.

## Constraints
Never delete required context to improve cache metrics. Never mark lists order-insensitive without an application contract proving order is irrelevant. Do not infer savings without measured usage data.

## Procedure
1. Capture at least 20 representative requests per variant when feasible.
2. Record `input_tokens`, `cached_tokens`, `cache_write_tokens` when available, latency, and named prefix sections.
3. Run the profiler on the untouched baseline.
4. Rank stable sections by transition change rate.
5. Inspect the highest-volatility section and form one testable cause, such as tool ordering, timestamps, generated IDs, or repository dumps.
6. Change one cause at a time; keep required semantics unchanged.
7. Re-run the same workload as candidate and run the existing quality suite.
8. Accept only if cache/latency gates and quality gates pass.

## Decision points
If volatility is low but provider cache reuse remains low, treat provider/runtime behavior as a separate hypothesis; do not keep rewriting prompts blindly. If quality regresses, reject the optimization regardless of token savings.

## Expected output
Baseline/candidate metrics, volatile-section evidence, tested hypothesis, accepted/rejected decision, and residual risks.

## Metrics
Cache ratio, cache-write ratio, uncached tokens/task, p50/p95 latency, stable-section change rate, quality regression rate.

## Verification
Results must be reproducible from saved traces and the deterministic profiler; quality must be verified independently by the existing evaluation suite.

## Failure handling
Invalid traces block analysis. Missing cache-write telemetry is documented as unavailable rather than treated as zero cost in conclusions.

## Stop conditions
Stop after two failed optimization hypotheses without new evidence, or immediately on correctness/security regression; escalate for deeper provider/framework investigation.
