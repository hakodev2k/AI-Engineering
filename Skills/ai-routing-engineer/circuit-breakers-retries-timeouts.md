# Circuit Breakers, Retries, and Timeouts

## Purpose
Control transient AI provider failures without causing retry storms, runaway latency, duplicate side effects, or cascading capacity collapse.

## When to use
Use when routing invokes remote models, gateways, retrieval systems, or tools with variable latency and failure behavior.

## Inputs
Provider error taxonomy, latency distributions, idempotency properties, retry guidance, SLOs, concurrency, and dependency health signals.

## Preconditions
The system must distinguish transport failures, throttling, deterministic request errors, and application-level invalid responses.

## Context to inspect
HTTP/gRPC clients, SDK retry defaults, gateway retry layers, load balancers, queues, time budgets, circuit-breaker state, and tool-call side effects.

## Core knowledge
Retries multiply load and can turn partial degradation into an outage. Exponential backoff with jitter helps only when retries are safe and bounded. Timeout budgets should be derived from end-to-end SLOs. Circuit breakers should react to meaningful dependency health rather than isolated errors.

## Procedure
1. Classify provider failures by retryability.
2. Determine whether the request or tool action is idempotent.
3. Set an end-to-end request deadline.
4. Allocate per-attempt timeouts inside that deadline.
5. Limit retry count and total retry budget.
6. Add backoff and jitter for retryable throttling/transient failures.
7. Define circuit-breaker open, half-open, and recovery criteria.
8. Coordinate retries across gateway and SDK layers to avoid duplication.
9. Emit metrics for attempts, reasons, and breaker state.
10. Load-test degraded behavior.

## Decision points
Do not retry deterministic 4xx-style failures. Avoid automatic retries after externally visible non-idempotent actions. Prefer failover or fast failure when remaining deadline cannot support another meaningful attempt.

## Common failure patterns
Nested retries, no jitter, retrying rate limits immediately, retrying streamed requests after partial delivery, and breakers that flap.

## Verification
Fault injection confirms bounded attempts, bounded latency, no duplicate side effects, and stable recovery after dependency restoration.

## Expected output
A documented resilience policy with retry taxonomy, timeout budgets, breaker thresholds, telemetry, and tests.

## Stop conditions
Stop if idempotency cannot be established for side-effecting operations or provider failure semantics are unknown.