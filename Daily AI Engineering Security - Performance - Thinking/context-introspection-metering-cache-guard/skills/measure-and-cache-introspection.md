# Skill: Measure and Cache Context Introspection

## Purpose
Measure hidden token/context introspection overhead and design a cache/budget policy that reduces auxiliary requests without losing correctness-critical context visibility.

## Trigger
Use when context gauges poll per turn, provider billing exceeds local telemetry, tool catalogs are large, or SDK/provider behavior changes.

## Inputs
JSONL auxiliary-call trace with timestamp, turn, provider, model, fingerprint, input_tokens, latency_ms, cost, and cache_hit fields; optional provider billing totals.

## Preconditions
Capture a representative baseline before optimization.

## Required context
Provider/adapter path, model identity, tool/skill/memory serialization rules, and context-overflow behavior.

## Allowed tools
Read-only trace analysis, provider logs, hashing, `scripts/introspection_analyzer.py`, deterministic tests.

## Constraints
Do not remove required context, weaken safety instructions, or claim savings without before/after evidence.

## Procedure
1. Establish baseline over at least one representative task/session.
2. Count auxiliary requests, input tokens, latency, cost, unique fingerprints, and repeated unchanged fingerprints.
3. Separate normal model turns from introspection/control-plane calls.
4. Identify whether repeated fingerprints are counted remotely more than once.
5. Hypothesize cache key/invalidation boundaries using provider, model, serialization version, and fingerprint.
6. Set explicit per-turn/session introspection budgets from baseline and acceptable freshness requirements.
7. Implement caching/event-driven refresh in the host.
8. Re-run the same workload.
9. Compare request count, tokens, latency, cache-hit rate, provider/local reconciliation, and context-overflow/quality regressions.
10. If improvement is absent, revise the hypothesis at most twice.
11. Hand off traces to the independent Token Verifier.

## Decision points
- Repeated unchanged fingerprint with remote calls: cache candidate.
- Changed model/provider/schema/content: invalidate.
- Missing local telemetry but provider calls exist: accounting defect; block optimization sign-off.
- Lower token use with stale/incorrect context pressure: reject optimization.

## Expected output
Baseline/optimized metrics, repeated-fingerprint table, cache policy, budget verdict, regression status.

## Metrics
Requests/turn, tokens/turn, cost/task, latency, cache hit rate, provider-local delta, context overflow regressions, task-quality regression rate.

## Verification
Run analyzer against baseline and optimized traces and require measurable reduction plus no correctness regression.

## Failure handling
Malformed traces or missing required fields invalidate measurement. Preserve baseline and stop rather than estimating savings from incomplete data.

## Stop conditions
Maximum two optimization retries; stop on regression, unverifiable provider reconciliation, or budget/quality conflict requiring human design review.