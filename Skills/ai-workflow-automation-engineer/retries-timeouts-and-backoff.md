# Retries, Timeouts, and Backoff

## Purpose
Design bounded retry behavior that improves resilience without amplifying outages, duplicating side effects, or hiding permanent failures.

## When to use
Use for network calls, queues, databases, SaaS APIs, model providers, and other transiently failing dependencies.

## Inputs
Dependency SLA, error taxonomy, idempotency behavior, rate limits, timeout guidance, business deadline, and retry budget.

## Context to inspect
Inspect actual error codes, latency percentiles, provider retry headers, queue redelivery behavior, existing retry layers, and incident history.

## Core knowledge
Timeouts bound resource occupancy; retries consume additional load; backoff spreads contention. Retries are appropriate only for transient failures and safe operations. Multiple hidden retry layers can multiply attempts dramatically.

## Procedure
1. Classify dependency failures into transient, permanent, throttling, validation, authentication, and unknown.
2. Set explicit connection and operation timeouts below the overall business deadline.
3. Determine whether each operation is idempotent or protected by an idempotency key.
4. Retry only transient and explicitly retryable failures.
5. Apply exponential backoff with jitter.
6. Honor provider retry-after guidance.
7. Cap attempts and total elapsed time.
8. Coordinate retries across workflow, connector, SDK, proxy, and queue layers.
9. Route exhausted operations to a recoverable failure path.
10. Emit metrics for attempts, exhausted retries, timeout rate, and dependency health.
11. Load-test retry behavior during simulated dependency degradation.

## Decision points
Fail fast for validation and authentication errors. Retry throttling according to provider guidance. Prefer asynchronous recovery when business deadlines allow.

## Common failure patterns
Infinite retries, retrying non-idempotent writes, fixed synchronized intervals, timeouts longer than caller deadlines, and nested retry policies causing storms.

## Verification
Inject timeouts, throttling, transient 5xx errors, permanent 4xx errors, and partial outages. Confirm bounded attempts and no duplicate effects.

## Expected output
A documented retry/timeout policy per dependency with error classification, budgets, backoff, telemetry, and recovery handling.

## Stop conditions
Stop when retry safety is unknown for a side effect or dependency guidance conflicts with business correctness requirements.