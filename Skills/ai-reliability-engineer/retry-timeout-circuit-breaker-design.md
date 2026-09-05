# Retry, Timeout, and Circuit Breaker Design

## Purpose
Prevent transient AI dependency failures from cascading into latency spikes, cost blowouts, queue saturation, and duplicate side effects.

## When to use
Use for model APIs, retrieval services, vector databases, tool integrations, queues, and third-party dependencies.

## Inputs
Latency distributions, error taxonomy, idempotency guarantees, dependency limits, request deadlines, retry history, queue metrics.

## Preconditions
Call paths and side-effect semantics are understood.

## Context to inspect
Client libraries, retry defaults, global deadlines, concurrency limits, circuit-breaker state, job queues, provider rate limits.

## Core knowledge
Retries consume the same finite deadline and capacity as the original request. Non-idempotent operations can become correctness incidents when retried. Circuit breakers protect dependencies and callers by failing fast during sustained faults.

## Procedure
1. Define end-to-end request deadline.
2. Allocate per-hop timeout budgets.
3. Classify errors as retryable or terminal.
4. Disable retries for unsafe non-idempotent operations unless protected by idempotency keys.
5. Limit attempts and use exponential backoff with jitter.
6. Add concurrency limits and circuit breaking where overload can cascade.
7. Bound queue age and abandon expired work.
8. Propagate cancellation downstream.
9. Test slow, unavailable, throttled, and partial-failure scenarios.
10. Monitor retries as a first-class reliability signal.

## Decision points
Prefer hedging only for read-like operations where duplicate work is acceptable. Prefer fail-fast behavior when the remaining deadline cannot accommodate useful retry.

## Common failure patterns
Layered retries, infinite retries, retrying rate limits without backoff, ignoring cancellation, and duplicate tool actions.

## Verification
Fault injection confirms bounded latency, bounded attempts, no duplicate side effects, and recovery after dependency health returns.

## Expected output
A documented timeout/retry/circuit-breaker policy with tests and telemetry.

## Stop conditions
Escalate when dependency semantics or idempotency guarantees are unknown.