# Skill: Cache Economics Analysis

## Purpose
Measure whether prompt caching is compatible, economical, and quality-preserving for a long-running agent workload.

## Trigger
Model/provider upgrade, cache-field change, compaction change, cost anomaly, latency regression, or repeated request failure.

## Inputs
Rendered request metadata, model identifier, cache options, recent usage counters, task success metrics, provider documentation.

## Preconditions
Credentials are excluded. Usage counters come from the same model/provider path being evaluated.

## Required context
Model capability policy, stable/variable prompt boundary, representative workload, baseline success criteria.

## Allowed tools
Read-only logs, provider docs, `scripts/cache_guard.py`, local tests, cost calculator.

## Constraints
- MUST NOT remove correctness-critical context only to reduce tokens.
- MUST NOT infer cache support from model name alone when provider behavior differs.
- MUST compare before/after on representative tasks.

## Procedure
1. Capture baseline input, read, write, latency, retry, and quality metrics.
2. Validate request fields against the model policy.
3. Compute cache-write share and write/read ratio.
4. Identify stable prefix mutations, compaction boundaries, and unsupported fields.
5. Form one explicit hypothesis, such as "deprecated retention field causes 400" or "mutable tool schema causes cache rewrite."
6. Change one variable.
7. Re-run representative tasks.
8. Compare economics and quality.
9. Stop after two failed hypotheses and escalate.

## Decision points
Block on incompatibility. Warn or block on budget threshold depending on policy. Accept only if quality regression stays within the declared tolerance.

## Expected output
Facts, Evidence, Hypothesis, Change, Before/After Metrics, Risks, Verification Status.

## Metrics
Tokens/task, cache-read ratio, cache-write ratio, write/read ratio, cost/task, p50/p95 latency, retry rate, task success rate.

## Verification
Independent verifier checks the policy mapping, telemetry arithmetic, and quality comparison.

## Failure handling
Preserve baseline data, revert the single change, try at most one alternate hypothesis, then escalate.

## Stop conditions
Unsupported field, missing telemetry, critical quality regression, or two failed optimization attempts.
