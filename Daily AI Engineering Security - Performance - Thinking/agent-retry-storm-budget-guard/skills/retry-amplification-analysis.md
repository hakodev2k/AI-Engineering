# Skill — Retry Amplification Analysis

## Purpose
Measure and reduce retry amplification in AI-agent workflows without sacrificing safe transient-failure recovery.

## Trigger
A dependency outage, elevated retry count, high agent latency, unexpected API/tool cost, or any retry-policy change.

## Inputs
Structured traces containing task ID, logical operation ID, endpoint, original/retry marker, attempt number, status/error class, latency, idempotency, and final outcome.

## Preconditions
A representative baseline trace exists and operations with side effects have known idempotency semantics.

## Required context
Retry configuration at orchestration, SDK, connector, auth, model, and subagent layers.

## Allowed tools
Trace queries, unit tests, synthetic failure injection in non-production environments, `scripts/retry_guard.py`.

## Constraints
MUST NOT generate destructive production failures. MUST NOT mark non-idempotent operations retryable merely to increase completion rate.

## Procedure
1. Group calls by task and logical operation.
2. Count original attempts and retries.
3. Compute retry amplification factor `(original + retries) / original`.
4. Map every retrying layer and identify duplicate ownership.
5. Separate transient, persistent, client, auth, throttling, and unknown failures.
6. Verify idempotency for each retryable operation.
7. Form one testable hypothesis about the dominant amplification source.
8. Apply the smallest policy change that establishes a shared budget or removes duplicate ownership.
9. Replay the same failure fixtures.
10. Compare amplification, p95 latency, transient recovery, and duplicate side effects.

## Decision points
Fail fast on non-retryable status, unknown idempotency for side effects, exhausted task budget, or open circuit.

## Expected output
Baseline/candidate metrics, identified retry owner, policy delta, risks, and verification status.

## Metrics
Retry amplification factor, retries/task, p95 task latency, transient recovery rate, circuit-open count, duplicate-side-effect count.

## Verification
Independent verifier reproduces the comparison with the same fixtures.

## Failure handling
Restore the last verified policy; retain traces; maximum 2 diagnostic revisions before escalation.

## Stop conditions
No baseline, unresolved side-effect semantics, duplicate side effects, or exhausted revisions.
