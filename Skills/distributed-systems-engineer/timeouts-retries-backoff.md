# Timeouts, Retries, and Backoff

## Purpose
Bound remote-call latency and recover from transient failures without creating retry storms or uncontrolled resource consumption.

## When to use
Use for HTTP/RPC clients, databases, brokers, cloud APIs, service-to-service calls, and background workers.

## Inputs
Latency distributions, dependency SLOs, request deadline, error taxonomy, idempotency guarantees, and traffic volume.

## Context to inspect
Inspect nested retries, SDK defaults, proxy/load-balancer timeouts, cancellation propagation, queue retry settings, and circuit breakers.

## Core knowledge
A timeout is a resource and correctness boundary, not proof the remote operation failed. Retries multiply load and tail latency. Backoff, jitter, retry budgets, and end-to-end deadlines prevent amplification.

## Procedure
1. Measure normal and tail dependency latency.
2. Establish an end-to-end deadline.
3. Allocate bounded time budgets to downstream calls.
4. Classify retryable versus permanent errors.
5. Confirm operations are safe to retry.
6. Limit attempts and total retry time.
7. Apply exponential or appropriate backoff with jitter.
8. Propagate cancellation/deadlines where supported.
9. Instrument attempts, exhausted retries, and timeout causes.
10. Load-test degraded dependencies.

## Decision points
Retry locally when transient recovery is likely and latency budget allows it. Prefer queue redelivery for durable asynchronous work. Avoid retries when overload is the cause unless delayed and budgeted.

## Common failure patterns
No timeout, identical fixed retry intervals, retries at every layer, retrying validation errors, and using a timeout longer than the caller deadline.

## Verification
Simulate latency, throttling, transient faults, and persistent outage. Confirm bounded latency, bounded attempts, cancellation, and no retry amplification.

## Expected output
Documented timeout and retry policies with measured behavior under degradation.

## Stop conditions
Stop when dependency error semantics or idempotency guarantees are unknown and retries could duplicate irreversible work.