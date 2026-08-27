# Skill: Cache Churn Analysis

## Purpose
Diagnose token/cost regressions caused by prompt-cache churn without confusing them with normal long-context latency.

## Trigger
Unexpected token spend, cache-write spikes, or degraded latency in a long-running AI session.

## Inputs
Per-request usage trace, prefix fingerprint, client/version metadata, session phase, candidate change.

## Preconditions
A stable quality test exists; telemetry excludes prompt and secret content.

## Required context
Usage counters, timing, cache TTL/settings, expected request cadence, stable-prefix composition.

## Allowed tools
Read-only logs, deterministic analyzer, provider usage documentation, version diff.

## Constraints
MUST NOT remove correctness-critical context solely to improve token metrics. MUST distinguish observed cache churn from inferred root cause.

## Procedure
1. Capture at least 10 representative baseline requests when feasible.
2. Compute cache read/create ratios and latency.
3. Locate the first churn event.
4. Compare stable-prefix fingerprints immediately before/after.
5. Separate TTL expiry, intentional prefix mutation, client restart, and unexplained invalidation.
6. Form one testable hypothesis.
7. Change one variable only.
8. Re-measure; retry at most twice.
9. Run quality/regression tests.

## Decision points
If churn occurs with unchanged fingerprint inside expected TTL, classify as unexplained/client-provider cache regression. If fingerprint changes, inspect prompt assembly before changing TTL.

## Expected output
Facts, Evidence, Hypothesis, Change, Before/After Metrics, Quality Result, Verification Status.

## Metrics
Tokens/task, cache read ratio, cache creation ratio, latency p50/p95, prefix changes, quality regression rate.

## Verification
Independent verifier repeats analysis on the saved trace and confirms quality tests.

## Failure handling
If telemetry is incomplete, stop after one instrumentation retry. Preserve context and escalate rather than optimizing blind.

## Stop conditions
Two failed optimization hypotheses, missing usage counters, or any correctness regression.
