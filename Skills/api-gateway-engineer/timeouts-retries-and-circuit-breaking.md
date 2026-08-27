# Timeouts, Retries, and Circuit Breaking

## Purpose
Bound request latency and contain downstream failure propagation.

## When to use
Use when defining resilience policy or investigating latency amplification, retry storms, or cascading failures.

## Inputs
End-to-end latency budget, backend SLOs, idempotency semantics, error taxonomy, traffic volume.

## Context to inspect
Client deadlines, gateway timeouts, upstream timeouts, retry layers, connection pools, backend concurrency limits.

## Core knowledge
Understand deadline propagation, retry budgets, exponential backoff with jitter, idempotency, circuit states, retry amplification, and load shedding.

## Procedure
1. Start from the caller-visible deadline.
2. Allocate smaller upstream timeouts with processing margin.
3. Classify errors as retryable or terminal.
4. Retry only safe/idempotent operations unless an idempotency mechanism exists.
5. Bound retries by attempts and total retry budget.
6. Add jitter and respect upstream retry hints.
7. Configure circuit breaking against meaningful failure signals.
8. Observe retries, timeout causes, and circuit transitions.

## Decision points
Prefer fewer retries when downstream saturation is likely. Use circuit breaking for persistent failures, not as a substitute for capacity planning. Hedge requests only for carefully measured tail-latency cases.

## Common failure patterns
Retries at every layer, retrying writes blindly, gateway timeout longer than client deadline, zero jitter, circuits triggered by client errors.

## Verification
Inject latency and failures, confirm bounded request duration, retry counts, safe write behavior, and recovery after circuit opening.

## Expected output
A resilience policy tied to latency budgets and operation semantics.

## Stop conditions
Escalate if idempotency or backend failure semantics are unknown.