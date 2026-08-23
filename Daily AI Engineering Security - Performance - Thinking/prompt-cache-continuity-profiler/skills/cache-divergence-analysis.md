# Skill — Cache Divergence Analysis

## Purpose
Explain prompt-cache misses by locating the earliest changed prompt segment and separating prefix drift from TTL/key/provider effects.

## Trigger
Use when cached-input ratio falls, uncached tokens/cost rise, latency increases, or a prompt/cache configuration changes.

## Inputs
Two or more request profiles, ordered segment fingerprints, provider token usage, cache key/breakpoint metadata, request timestamps, and task quality results.

## Preconditions
Profiles correspond to comparable tasks or repeated turns; sensitive raw prompt logging is not required.

## Required context
Provider cache semantics, tenant/workspace boundary, expected stable/volatile segments, and critical-context requirements.

## Allowed tools
`scripts/cache_profile.py`, metrics queries, deterministic test runner, read-only prompt-template/config inspection.

## Constraints
Do not expose prompt secrets. Do not assume a miss is caused by expiry when fingerprints changed. Do not remove required context to improve hit rate.

## Procedure
1. Capture at least three baseline profiles for representative tasks.
2. Compute cached ratio, uncached tokens, cache writes, latency, and ordered segment fingerprints.
3. Compare consecutive profiles and identify the first segment whose fingerprint changed.
4. If no segment changed, inspect cache key, breakpoint, elapsed time/TTL, model, tenant, and provider routing metadata.
5. Classify the cause as prefix drift, key drift, TTL/idle gap, model/config change, provider/unknown, or mixed.
6. Form one improvement hypothesis: reorder stable/volatile segments, canonicalize structured content, stabilize a key, apply an explicit breakpoint, or use a cacheable MCP list response.
7. Re-run identical fixtures and compare quality plus token/cost/latency metrics.
8. Allow at most two hypothesis revisions.
9. Require independent verification before `Verified` status.

## Decision points
- Changed early segment: fix prefix stability before tuning TTL.
- No changed segment but changed key/model: fix request metadata/configuration.
- No local divergence and elapsed time exceeds documented cache lifetime: classify as expected expiry, not application regression.
- Quality worsens after compression/reordering: reject the optimization.

## Expected output
Cause classification, divergence segment, safe fingerprints, before/after metrics, risks, and verification status.

## Metrics
Cached-input ratio, uncached input tokens/task, cache-write tokens/task, stable-prefix ratio, divergence index, cost/task, latency, quality, critical-context regression.

## Verification
A candidate passes only if cache/cost/latency metrics improve or remain within thresholds, quality does not regress, and critical context is preserved.

## Failure handling
Preserve profiles, restore prior prompt/config, document the failed hypothesis, and retry at most twice.

## Stop conditions
Verified improvement; two failed hypotheses; insufficient provider telemetry; or any correctness/security regression.
