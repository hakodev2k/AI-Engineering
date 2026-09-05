# Skill: Retry Path Performance Analysis

## Purpose
Measure and diagnose whether an AI workflow is over-retrying persistent failures or under-retrying recoverable transient failures.

## Trigger
Repeated errors, unusually high retry latency/cost, stalled agent loops, or expensive jobs aborting on transient transport/provider errors.

## Inputs
Error traces; provider/tool response codes; attempt timestamps; tool/model-call counts; token/cost telemetry; task success; observable state-change events.

## Preconditions
A reproducible or recorded workload exists. Capture baseline before changing retry policy.

## Required context
All retry layers: SDK, transport, tool wrapper, orchestration loop, and outer agent loop.

## Allowed tools
Logs/traces, metrics queries, test runners, safe failure injection, `scripts/retry_guard.py`.

## Constraints
Do not retry destructive side effects unless idempotency/reconciliation is proven. Do not weaken auth, permission, policy, or security controls.

## Procedure
1. Measure baseline retries/task, elapsed retry time, calls, tokens/cost, recovery rate, and terminal behavior.
2. Trace every retry layer and count hidden nested retries.
3. Normalize observed failures into retryable, non-retryable, or unknown classes using documented provider/tool semantics.
4. Fingerprint recurring failures using stable fields such as status code, normalized exception type, operation, and sanitized cause.
5. Record whether state changed between attempts.
6. Form hypotheses: over-retry from misclassification, nested retry multiplication, missing terminal propagation, or under-retry of transient faults.
7. Replay representative episodes through the deterministic gate.
8. Implement the smallest policy/control change.
9. Measure the same workload again.
10. If metrics do not improve, re-evaluate once; maximum two tuning cycles.
11. Hand results to Retry Verifier.

## Decision points
Auth/permission/policy/validation => stop unless policy explicitly documents a safe recoverable case. Retryable transient class + remaining budgets => one retry. Repeated unchanged fingerprint at budget => stop. Unknown => stop and classify offline.

## Expected output
Baseline, error taxonomy, retry-layer map, hypotheses, policy diff, before/after metrics, verification status.

## Metrics
Retries/task; time-to-terminal; recovery rate; calls/tokens/cost; repeated-fingerprint count; false retry; false stop; task success.

## Verification
Before/after fixtures use the same workload and acceptance criteria. Improvement requires lower wasted work with equal or better accepted success.

## Failure handling
If error semantics remain ambiguous after one documentation/trace pass, classify as unknown and stop automatic retry.

## Stop conditions
Two policy-tuning cycles, security/quality regression, or inability to establish a trustworthy baseline.