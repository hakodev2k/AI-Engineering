# Workflow — Cache Regression Investigation

## Trigger
Cache-read ratio drops, uncached/cache-creation tokens spike, or an upgrade changes request serialization.

## Goal
Find and remove accidental cache-prefix instability with measurable evidence.

## Inputs
Sanitized baseline/current request dumps, segment definition, optional cache/token/latency telemetry.

## Baseline
Capture at least three equivalent runs and record static fingerprints, cache-read ratio, uncached input, cache creation, latency, and result-quality checks.

## Stages
1. Sanitize and validate dumps.
2. Fingerprint static segments.
3. Locate earliest divergence.
4. Classify drift versus TTL/provider behavior.
5. Form one hypothesis.
6. Change serializer/configuration minimally.
7. Repeat workload three times.
8. Compare structural and provider metrics.
9. Run quality/security regression checks.
10. Accept or perform at most two additional hypothesis cycles.

## Responsible agent
Implementation owner changes prompt assembly; Cache Regression Verifier performs independent verification.

## Tools
`scripts/cache_stability_profiler.py`, request logs, provider usage telemetry, test harness.

## Outputs
Diff report, before/after metrics, root cause, accepted/rejected hypothesis, verification status.

## Checkpoints
Baseline captured; earliest divergence identified; no required context removed; repeated verification complete.

## Metrics
Static stability rate, cache-read ratio, uncached/cache-creation tokens, latency, quality regression rate.

## Retry policy
Maximum three hypothesis cycles total.

## Stop conditions
Verified improvement; intentional change documented; missing telemetry prevents a performance claim; or three failed hypotheses require escalation.

## Failure path
Revert risky prompt changes, retain evidence, and report the unresolved divergence/provider behavior.

## Verification
Equivalent workload must produce stable declared-static fingerprints and meet configured telemetry thresholds without quality loss.

## Definition of Done
Root cause evidenced, change minimal, repeated measurements captured, no critical context loss, independent verification passed.
