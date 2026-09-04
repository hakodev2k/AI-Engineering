# Dependency Failure Resilience

## Purpose
Keep ML services predictable when feature stores, registries, databases, queues, object storage, or external inference dependencies become slow or unavailable.

## When to use
Use when designing production ML serving paths, reviewing dependency incidents, or introducing a new external service into inference or retraining.

## Inputs
- Dependency graph
- Latency and availability SLOs
- Client timeout/retry configuration
- Fallback options
- Historical failure data

## Context to inspect
Inspect synchronous versus asynchronous calls, shared failure domains, retry behavior, connection pools, queue limits, caching, dependency quotas, and whether requests are idempotent.

## Core knowledge
Retries can amplify outages. Reliable ML systems use bounded timeouts, jittered retries only for transient/idempotent operations, circuit breaking, bulkheads, backpressure, cached or degraded paths, and explicit dependency budgets.

## Procedure
1. Map every dependency on the critical prediction and training paths.
2. Assign latency and availability budgets to each synchronous dependency.
3. Define timeouts shorter than the caller's total deadline.
4. Classify failures as retryable or deterministic.
5. Bound retry count and apply backoff with jitter.
6. Add concurrency limits, circuit breaking, or isolation where cascading failure is possible.
7. Define fallback behavior for unavailable dependencies.
8. Instrument dependency latency, errors, saturation, retries, and fallback activation.
9. Inject latency, errors, and partial outages in a controlled environment.
10. Validate recovery after the dependency returns.

## Decision points
Remove a dependency from the synchronous path when its latency or reliability cannot meet the service budget. Cache only when staleness is safe. Retry writes only when idempotency is guaranteed.

## Common failure patterns
- Nested retries multiply traffic.
- Caller timeout is shorter than dependency retry sequence.
- All model replicas share one fragile dependency.
- Circuit breaker opens without a usable fallback.
- Dependency recovery triggers a synchronized retry storm.

## Verification
Verify bounded latency during dependency faults, controlled retry volume, no cascading resource exhaustion, correct fallback behavior, and stable recovery.

## Expected output
A dependency resilience design with budgets, timeout/retry policies, isolation, fallback, observability, and fault-test evidence.

## Stop conditions
Stop deployment if a critical dependency has no bounded failure behavior or if retry/idempotency semantics are unknown.