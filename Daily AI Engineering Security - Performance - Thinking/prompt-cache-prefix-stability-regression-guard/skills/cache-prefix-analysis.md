# Skill — Cache Prefix Analysis

## Purpose
Measure and diagnose prompt-cache reuse problems in tool-heavy agent requests without sacrificing correctness-required context.

## Trigger
Run after changes to prompt assembly, tool schemas, memory/context injection, compaction, provider routing, middleware, or cache configuration; also run when cache-hit rate, input cost, or latency regresses.

## Inputs
- Ordered request-component manifest.
- Optional previous baseline manifest/report.
- Cache policy thresholds.
- Optional provider usage fields such as cache-read/cache-write/cache-hit/cache-miss tokens.
- Representative task-quality/security fixtures.

## Preconditions
- Request components are captured before provider transport.
- Sensitive values are redacted from saved diagnostics.
- Baseline and candidate use comparable model/provider/settings when measuring provider telemetry.

## Required context
Component type, order, content or redacted hashable representation, stability classification, provider cache semantics, and task-quality acceptance tests.

## Allowed tools
Local hashing, canonical JSON serialization, byte/token estimation, provider usage telemetry, benchmark harness, and read-only request dumps.

## Constraints
- MUST NOT delete security/system requirements to improve cache reuse.
- MUST NOT assume a lower token count means better performance without measuring latency/cost/quality.
- SHOULD canonicalize only structures whose ordering is semantically irrelevant.

## Procedure
1. Capture a baseline on at least three equivalent repeated turns.
2. Split each request into ordered components: system policy, tools, static reference context, memory, conversation history, tool outputs, volatile metadata, user input.
3. Mark each component `stable`, `conditionally-stable`, or `volatile`.
4. Compute bytes, estimated tokens, canonical content hash, and cumulative prefix hash.
5. Compare repeated equivalent turns and identify the earliest component where the cumulative prefix changes.
6. Determine root cause: timestamp/session ID, tool-order churn, JSON key/order churn, compaction rewrite, dynamic repository context, provider cache TTL, or genuinely changed task context.
7. Form one optimization hypothesis at a time.
8. Apply only correctness-preserving changes: canonical serialization, deterministic tool order, stable static-prefix placement, dynamic data after stable content, bounded tool-output compaction, or provider-specific cache point placement.
9. Repeat the same benchmark workload.
10. Compare stable-prefix bytes, provider cache metrics, latency, cost, and quality/security fixtures.
11. Accept only when regression thresholds pass.

## Decision points
- Prefix stable but cache misses remain → investigate provider TTL/model/minimum-threshold behavior.
- Prefix changes before a semantically static component → fix serialization/order first.
- Prefix changes because task-required evidence changed → do not force stability.
- Optimization reduces tokens but quality/security fixture fails → reject optimization.

## Expected output
A report containing earliest churn point, component deltas, current/baseline fingerprints, estimated cacheable size, provider cache metrics when available, hypothesis, before/after measurements, and verification status.

## Metrics
Stable-prefix size, prefix churn frequency, cache hit ratio, cache-miss tokens, input cost/task, latency/task, tool-schema size, task pass rate, security fixture pass rate.

## Verification
Use deterministic regression tests plus provider telemetry on representative tasks. A separate verifier reviews accepted changes.

## Failure handling
Invalid manifests fail analysis. Missing provider telemetry downgrades provider-cache verification to “not measured” rather than inventing results. Maximum two optimization retries per root-cause hypothesis.

## Stop conditions
Stop when improvement is verified, two bounded attempts fail, required context would need removal, or a quality/security regression appears.
