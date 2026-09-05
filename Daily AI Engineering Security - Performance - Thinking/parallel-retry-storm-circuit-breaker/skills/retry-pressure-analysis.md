# Skill: Retry Pressure Analysis

## Purpose
Diagnose whether agent/workflow failures are caused by transient dependency errors, excessive concurrency, synchronized retries, insufficient retry budget, or non-retryable failures.

## Trigger
429/5xx bursts, repeated tool/model retries, sharp token/call growth, provider throttling, or a parallel workflow that returns little usable output.

## Inputs
Event trace with timestamps, branch/worker IDs, status codes, retry delays, attempts, tokens/calls, concurrency, and partial-result checkpoints.

## Preconditions
Establish a baseline on the same workload. Keep provider/API safety and rate-limit requirements intact.

## Required context
Dependency identity, retryability policy, concurrency limits, provider `Retry-After` semantics, global workflow budget, and partial-result contract.

## Allowed tools
Logs/traces, provider headers, benchmark harness, `scripts/retry_storm_guard.py`, configuration readers.

## Constraints
Do not bypass provider rate limits. Do not increase concurrency to compensate for throttling. Do not retry authentication/authorization or deterministic validation failures.

## Procedure
1. Measure baseline calls, tokens, latency, concurrency, success rate, and usable partial outputs.
2. Group failures by dependency and time window; detect correlated throttling.
3. Classify each failure as retryable, non-retryable, or unknown.
4. Inspect retry delay for minimum floor, jitter, and `Retry-After` handling.
5. Compute workflow-wide attempts and failure ratio inside the guard window.
6. Determine whether concurrency should be reduced, circuit opened, or retry budget increased within policy.
7. Preserve successful partial outputs before retrying failed branches.
8. Re-run the same fixture and compare useful output per call/token.

## Decision points
Correlated 429s -> reduce concurrency and consider opening circuit. Zero-delay retry -> enforce minimum floor. Non-retryable 4xx -> stop branch. Budget exhausted -> stop/escalate. Healthy probes after cooldown -> half-open then gradually restore concurrency.

## Expected output
Baseline, pressure diagnosis, error classification, retry/concurrency hypothesis, before/after metrics, and verification status.

## Metrics
Requests/sec, concurrent branches, retries/task, tokens/task, tool/model calls/task, 429 rate, useful-result rate, partial-results preserved, latency, throughput, recovery rate, wasted-token ratio.

## Verification
Replay throttling and healthy-provider fixtures; confirm bounded retries, nonzero delay, adaptive concurrency, and partial-result preservation.

## Failure handling
Retry analysis data collection once for transient log gaps. Unknown error class is not automatically retryable.

## Stop conditions
Global retry budget exhausted; circuit opens; failure is non-retryable; or two optimization iterations fail to improve useful-output efficiency.