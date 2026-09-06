# API Resilience Policies

## Purpose
Define timeouts, retries, circuit breaking, load shedding, and fallback behavior that improve reliability without amplifying failures.

## When to use
Use when standardizing client/gateway resilience or investigating cascading failures.

## Inputs
Dependency SLOs, latency distributions, idempotency semantics, traffic volume, failure history.

## Context to inspect
Inspect existing client libraries, gateway defaults, timeout chains, retry layers, queues, and dependency capacity.

## Core knowledge
Retries consume capacity and can worsen overload. Timeout budgets must shrink through dependency chains. Retries are safest for transient failures and idempotent operations.

## Procedure
1. Map request dependency chains.
2. Establish end-to-end latency budget.
3. Allocate explicit per-hop timeouts.
4. Classify retryable errors and operations.
5. Bound attempts with exponential backoff and jitter.
6. Prevent retries at multiple uncontrolled layers.
7. Add circuit breaking or load shedding where sustained failure warrants it.
8. Define safe fallbacks only when semantics permit.
9. Instrument attempts, timeout causes, and circuit state.
10. Fault-test policies under partial and total dependency failure.

## Decision points
Prefer no retry for non-idempotent operations unless an idempotency mechanism exists. Use circuit breakers for persistent dependency failure, not as a substitute for capacity management.

## Common failure patterns
Retry storms, timeout inversion, infinite retries, unsafe fallback data, and hiding dependency failures.

## Verification
Inject latency/errors and verify bounded amplification, predictable latency, correct recovery, and preserved business semantics.

## Expected output
Explicit resilience policies with tested failure behavior.

## Stop conditions
Stop if operation idempotency or end-to-end latency objectives are unknown.