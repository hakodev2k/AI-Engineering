# Skill: Backpressure Baseline and Classification

## Purpose
Measure current recovery behavior, preserve capacity metadata, and classify each retryable-looking failure before choosing wait, fallback, backoff, or failure.

## Trigger
Use when an LLM/provider/gateway returns 429, 503, 529, a structured capacity/rate-limit code, or a `Retry-After` header.

## Inputs
Request trace, HTTP status, structured error body, headers, provider/model, attempt timestamps, fallback configuration, and concurrency state.

## Preconditions
Capture a baseline from real traces or replay fixtures before changing policy.

## Required context
Know whether the failing endpoint is a local admission controller, upstream provider, model-specific capacity pool, account-level limiter, or unknown.

## Allowed tools
Trace/log inspection, deterministic replay fixtures, metrics queries, and `scripts/backpressure_classifier.py`.

## Constraints
Do not send live retry storms to production for testing. Do not bypass authentication, quotas, approval, or provider terms. Never claim improvement without before/after measurements.

## Procedure
1. Measure attempts/turn, inter-attempt delay, P95 recovery latency, fallback usage, and terminal failure rate.
2. Preserve status, code/type, `Retry-After`, scope hints, and provider/model before generic exception normalization.
3. Classify each event: local admission, provider capacity, burst-rate, ordinary rate limit, transport, or hard failure.
4. Form one recovery hypothesis for the dominant failure class.
5. Apply a single-owner recovery policy with cumulative attempt/time budget.
6. Replay the same fixtures and compare attempts, delay compliance, fallback selection, and completion outcome.
7. Run independent verification before rollout.

## Decision points
- Local admission + `Retry-After`: wait without model/credential fallback unless the cumulative wait budget expires.
- Provider capacity: bounded backoff, then configured fallback when policy permits.
- Burst-rate code: jittered smoothing and concurrency/ramp reduction; avoid synchronized immediate retry.
- Ordinary 429: honor `Retry-After` and quota policy.
- Unknown 5xx: bounded generic recovery, never infinite retry.

## Expected output
Baseline table, classification evidence, chosen recovery action, before/after metrics, and verification verdict.

## Metrics
Attempts/turn, inter-attempt delay, `Retry-After` compliance, fallback success, request burst coefficient, recovery latency, and terminal failures.

## Verification
Replaying identical error fixtures must produce stable action/reason codes and stay inside configured cumulative budgets.

## Failure handling
If metadata is missing, classify as `unknown` and use conservative bounded recovery. Retry diagnosis once after instrumentation is added; otherwise escalate.

## Stop conditions
Stop when all target error classes are deterministic, measurements improve or remain neutral without correctness regressions, or after two unsuccessful policy iterations.
