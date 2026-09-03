# Router Resilience and Circuit Breakers

## Purpose
Prevent unhealthy models or providers from destabilizing the entire inference service through bounded retries, circuit breakers, timeouts, isolation, and load shedding.

## When to use
Use for production routing across external providers, regional deployments, or shared inference clusters.

## Inputs
Failure taxonomy, timeout budgets, health signals, provider dependencies, fallback policy, concurrency limits, traffic priorities.

## Context to inspect
Retry layers, HTTP/client timeouts, queueing, connection pools, provider SLAs, health checks, historical incidents, and failure-domain boundaries.

## Core knowledge
Resilience mechanisms can amplify failures when layered carelessly. Retries consume capacity, circuit breakers require meaningful failure classification, and timeouts must respect the caller's end-to-end deadline. Bulkheads isolate failure domains.

## Procedure
1. Map each route to its independent and shared failure domains.
2. Define connect, first-token, idle, and total timeouts where applicable.
3. Classify retryable versus terminal errors.
4. Limit retry attempts using remaining deadline and idempotency constraints.
5. Configure circuit-breaker thresholds using rolling health signals.
6. Add half-open probing and controlled recovery.
7. Isolate concurrency by provider or critical traffic class.
8. Shed or queue work before saturation causes cascading failure.
9. Exercise failure modes with fault injection.
10. Tune thresholds from production evidence, not arbitrary defaults.

## Decision points
Open circuits for sustained dependency failure, not ordinary model-quality errors. Prefer independent fallback domains. Use hedging only for latency-critical idempotent requests when duplicate cost is acceptable.

## Common failure patterns
Retries at multiple layers, synchronized retry storms, circuits triggered by user errors, no half-open control, unbounded queues, and timeouts longer than the caller deadline.

## Verification
Verify fault-injection tests, bounded retries, circuit recovery, isolation under saturation, and compliance with end-to-end latency budgets.

## Expected output
A resilience design with timeout, retry, circuit-breaker, bulkhead, and load-shedding policies.

## Stop conditions
Stop if dependency failure semantics are unknown or requests have irreversible side effects without idempotency protection.