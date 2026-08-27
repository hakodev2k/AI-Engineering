# Timeouts, Retries, and Circuit Breaking

## Purpose
Coordinate failure-handling policies so load balancers improve resilience instead of amplifying overload.

## When to use
Use for intermittent backend failures, tail latency, retry storms, dependency outages, or proxy policy design.

## Inputs
Latency distributions, end-to-end deadlines, idempotency, retry budgets, error classes, and backend capacity.

## Context to inspect
Inspect timeout chains, application retries, SDK policies, proxy retries, circuit breakers, queues, and historical overload incidents.

## Core knowledge
Each retry consumes capacity. Layered retries multiply attempts. Timeouts should fit within the caller deadline. Retrying non-idempotent operations can duplicate side effects. Circuit breakers protect failing dependencies but can synchronize and flap if poorly tuned.

## Procedure
1. Map the end-to-end deadline.
2. Inventory retries at every layer.
3. Classify retryable errors and methods.
4. Allocate per-attempt timeout and retry budget.
5. Add backoff and jitter where retries span time.
6. Prevent duplicate retry layers where possible.
7. Define breaker thresholds and recovery probes.
8. Test slow, failed, and overloaded backends.
9. Measure amplification and success recovery.
10. Monitor attempts per original request.

## Decision points
Retry only when probability of transient recovery justifies added load. Prefer application-level retries when business idempotency is required; proxy retries can handle narrow transport failures safely.

## Common failure patterns
Retrying 5xx indiscriminately; retries at three layers; timeout longer than caller deadline; no jitter; circuit breaker ejecting all capacity simultaneously.

## Verification
Inject failures and verify bounded attempts, deadline compliance, no duplicate side effects, and stable recovery.

## Expected output
A coordinated timeout/retry/breaker policy with explicit budgets and evidence.

## Stop conditions
Escalate when idempotency is unknown, caller deadlines cannot be established, or retries could cause financial or irreversible side effects.