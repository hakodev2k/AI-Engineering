# Skill — Cache Gap Analysis

## Purpose
Find whether expensive prefix-cache misses are caused mainly by idle retention gaps or by avoidable application prefix churn.

## Trigger
Use when agent sessions have high TTFT, high uncached-input cost, or large prefixes with inconsistent cache behavior.

## Inputs
- JSONL step telemetry accepted by `../scripts/analyze_prefix_cache.py`
- `../config/policy.json`
- task-quality regression fixtures
- prompt/tool-schema builder code when churn is suspected

## Preconditions
- Provider cache counters are collected consistently.
- Timestamps use one clock domain.
- Sensitive prompt bodies are not required; fingerprints are preferred.

## Required context
Know which fields are intentionally dynamic, how tool definitions are ordered, and whether a gateway rewrites requests.

## Allowed tools
Telemetry query, local script execution, profiler, diff, provider usage metadata, repository search.

## Constraints
- MUST NOT remove correctness-, policy-, or security-critical context merely to improve caching.
- MUST distinguish measured cache behavior from inferred provider retention behavior.
- MUST preserve provider terms and privacy boundaries.

## Procedure
1. Capture an unchanged production-like baseline before editing prompts.
2. Run `python3 scripts/analyze_prefix_cache.py telemetry.jsonl --policy config/policy.json`.
3. Record weighted hit rate, uncached tokens, TTFT, fingerprint churn, and gap buckets.
4. Identify the highest uncached-token buckets rather than only the highest miss-rate buckets.
5. If misses correlate with long idle gaps but fingerprints are stable, classify as retention-gap dominated.
6. If misses occur at short gaps and fingerprints change, diff the stable-prefix builder and gateway transformations.
7. Move volatile fields after reusable static content where semantics permit; deterministically order tools/schemas.
8. Repeat the exact workload with the candidate configuration.
9. Compare uncached tokens/task and TTFT while running quality fixtures.
10. Stop only after metrics and quality verification are recorded.

## Decision points
- Stable fingerprint + long-gap misses: avoid prompt rewrite; consider session/cache architecture or accept provider retention behavior.
- Fingerprint churn at short gaps: fix deterministic construction first.
- Better cache metrics + worse quality: reject optimization.
- No measurable gain after two bounded iterations: stop and document non-benefit.

## Expected output
A diagnosis containing baseline, dominant miss clusters, root-cause classification, candidate change, before/after metrics, and verification status.

## Metrics
Weighted cache hit rate, uncached tokens/task, p50/p95 TTFT, churn rate, gap-bucket uncached tokens, task pass rate.

## Verification
The candidate MUST show a measured improvement without quality or safety regression; otherwise status is not Verified.

## Failure handling
Invalid telemetry blocks analysis. Missing TTFT permits token analysis but MUST be reported. Missing fingerprints prevents churn attribution and requires adding non-sensitive fingerprints before claiming root cause.

## Stop conditions
Stop after verified improvement, after two failed optimization iterations, or when changes would require removing required context.
