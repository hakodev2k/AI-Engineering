# Skill: Cache Prefix Diagnosis

## Purpose
Find the earliest unstable request component that prevents reusable prefix caching and quantify its impact before changing prompt structure.

## Trigger
Use when cached-input ratio is low, uncached input grows unexpectedly, or a prompt/tool/RAG layout changed.

## Inputs
Comparable request samples in the format accepted by `scripts/cache_profiler.py`, provider usage telemetry, latency/cost telemetry, and a quality/success signal.

## Preconditions
Samples must represent the same workflow class/model configuration. Secrets and private retrieved content must be redacted before analysis.

## Allowed tools
Telemetry queries, repository read/search, safe local scripts, provider usage metadata, deterministic hashing.

## Constraints
- MUST NOT remove context required for correctness or security.
- MUST NOT claim cache improvement without observed cached-token telemetry when the provider exposes it.
- MUST compare like-for-like request cohorts.
- SHOULD canonicalize stable serialization before compressing/removing content.

## Procedure
1. Define a comparable request cohort and capture at least the configured minimum sample count.
2. Record input tokens, cached tokens, latency, optional cost, and task quality.
3. Represent the rendered prompt as ordered named segments; mark segments expected to remain stable.
4. Run `scripts/cache_profiler.py` to compute cohort cache ratio and stable-segment hash variants.
5. Identify the earliest segment that differs between consecutive/comparable requests.
6. Trace the source: timestamp/ID, reordered tools, per-query summary, retrieved content, or nondeterministic serialization.
7. Form one minimal hypothesis: move volatile segment later, canonicalize it, or separate reusable and query-specific context.
8. Apply exactly one structural change where practical.
9. Re-run the same workload and compare cache ratio, latency/cost, and quality.
10. Hand results to `subagents/cache-verifier.md`.

## Decision points
If quality evidence is unavailable, optimization may be measured but not verified. If the unstable segment is correctness-critical and inherently dynamic, keep it and optimize later segments only. If provider telemetry does not expose cached tokens, report the limitation instead of inferring a hit from latency alone.

## Expected output
A baseline profile, first-divergence finding, root cause, changed layout, before/after metrics, quality comparison, and verification state.

## Metrics
Cached/input ratio; expected-stable hash variants; first divergence position; latency/task; input cost/task; success/quality regression.

## Verification
Improvement is verified only when cache reuse measurably improves without exceeding quality/latency regression limits.

## Failure handling
Maximum 3 optimization cycles. Each cycle must address a newly evidenced cause. Revert if quality regresses beyond policy.

## Stop conditions
Stop after 3 unsuccessful cycles, missing quality evidence when required, privacy-sensitive samples cannot be sanitized, or improvement requires dropping critical context.