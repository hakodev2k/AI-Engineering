# Retry Storm Testing

## Purpose
Detect cascading overload caused by synchronized or excessive retries during dependency degradation.

## When to use
Use for systems with synchronous remote calls, message redelivery, SDK retries, or layered retry policies.

## Inputs
Retry configuration, timeout budgets, traffic volume, dependency capacity, and telemetry.

## Context to inspect
Inspect retries at every layer, exponential backoff, jitter, max attempts, deadlines, circuit breakers, queue redelivery, and client fan-out.

## Core knowledge
Retries multiply load and can turn a small failure into an outage. Retry budgets, jitter, deadlines, idempotency, and load shedding are complementary controls.

## Procedure
1. Map all retry layers on a critical path.
2. Calculate worst-case request amplification.
3. Inject bounded latency or transient errors.
4. Measure attempt counts, concurrency, dependency load, and queue depth.
5. Observe backoff, jitter, deadline propagation, and circuit breaking.
6. Verify successful requests do not create duplicate effects.
7. Tune policies and rerun the experiment.

## Decision points
Retry only operations likely to succeed on another attempt and safe to repeat. Prefer fewer retries when deadlines are short or downstream capacity is constrained.

## Common failure patterns
Nested retries, fixed delays, retries after caller deadlines, retrying non-transient errors, and missing idempotency.

## Verification
Prove amplification remains bounded, recovery does not create a second traffic spike, and success/error behavior meets SLOs.

## Expected output
Measured retry amplification and validated retry policy improvements.

## Stop conditions
Stop when downstream saturation exceeds the approved threshold or duplicate side effects appear.