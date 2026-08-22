# Agent Reliability and Resilience

## Purpose
Keep agent workflows predictable when models, tools, networks, and external services fail.

## When to use
Use for production workflows with external dependencies or multi-step execution.

## Inputs
Dependency SLAs, failure modes, timeout budgets, retry policy, state model, business criticality.

## Context to inspect
Tool semantics, idempotency, rate limits, queues, persistence, fallback options, and observability.

## Core knowledge
Retries are safe only for transient failures and idempotent operations. Long agent chains multiply failure probability, latency, and cost.

## Procedure
1. Enumerate dependency and orchestration failure modes.
2. Set per-step and end-to-end deadlines.
3. Classify retryable versus terminal errors.
4. Add bounded exponential backoff with jitter.
5. Require idempotency for retryable writes.
6. Persist checkpoints for resumable workflows.
7. Add circuit breaking or load shedding where useful.
8. Define degraded modes and deterministic fallbacks.
9. Test partial completion and restart scenarios.
10. Measure success rate and recovery time by dependency.

## Decision points
Retry transient failures; fail fast on invalid requests or denied permissions. Resume from checkpoints when repeating prior side effects is unsafe.

## Common failure patterns
Infinite retries, retry storms, duplicate side effects, hidden partial success, no global deadline, and cascading fallback cost.

## Verification
Inject dependency failures and prove bounded retries, correct state, no duplicate mutations, and observable recovery.

## Expected output
A resilience policy with deadlines, retries, checkpoints, fallbacks, and tests.

## Stop conditions
Stop when safe recovery requires unsupported idempotency or unknown external semantics.