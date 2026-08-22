# API Resilience

## Purpose
Design API dependencies and clients to fail predictably under latency, partial outages, and transient faults.

## When to use
Use for service-to-service calls, third-party integrations, and production reliability reviews.

## Inputs
Dependency SLOs, latency budgets, failure modes, retry safety, and fallback options.

## Context to inspect
HTTP clients, connection pools, DNS behavior, timeouts, retries, circuit breakers, bulkheads, and telemetry.

## Core knowledge
Every remote call can fail or stall. Timeouts must fit an end-to-end deadline. Retries amplify load and are safe only for retryable, idempotent operations.

## Procedure
1. Map dependency chain and latency budget.
2. Set connection and request deadlines.
3. Classify retryable failures.
4. Add bounded jittered retries where safe.
5. Apply circuit breaking or load shedding where useful.
6. Isolate scarce resources.
7. Define degraded behavior deliberately.
8. Propagate cancellation/deadlines.
9. Instrument dependency latency and failures.
10. Run fault-injection tests.

## Decision points
Retry transient faults only when success probability and idempotency justify added load. Fail fast when deadlines are exhausted.

## Common failure patterns
No timeout, stacked retries across layers, retrying 4xx errors, huge timeout budgets, and fallback that hides corruption.

## Verification
Chaos/fault tests demonstrate bounded latency, controlled retries, and recovery after dependency restoration.

## Expected output
A tested resilience policy aligned with API SLOs.

## Stop conditions
Escalate when dependency guarantees cannot satisfy required service objectives.