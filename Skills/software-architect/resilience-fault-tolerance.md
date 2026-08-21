# Resilience and Fault Tolerance

## Purpose
Design software that degrades predictably, contains failures, and recovers without amplifying incidents.

## When to use
Use for remote dependencies, critical workflows, production instability, or systems with explicit availability targets.

## Inputs
Dependency map, SLOs, failure history, latency budgets, retry behavior, recovery objectives.

## Context to inspect
Timeouts, retries, circuit breakers, queues, fallback paths, bulkheads, health checks, and dependency SLAs.

## Core knowledge
Retries can amplify overload; timeouts must fit end-to-end latency budgets; circuit breakers protect dependencies, not correctness. Resilience must preserve business semantics.

## Procedure
1. Identify critical dependency paths.
2. Classify failure modes and blast radius.
3. Set bounded timeouts per hop.
4. Add retries only for transient, idempotent operations.
5. Use backoff and jitter.
6. Isolate high-risk workloads with bulkheads or queues.
7. Define safe degradation and fallback behavior.
8. Add health, metrics, and alerting.
9. Test overload, timeout, dependency loss, and recovery.

## Decision points
Prefer fail-fast for nonrecoverable errors; retry only when success probability improves. Queue work when delay is acceptable; reject load when continued processing would threaten the system.

## Common failure patterns
Infinite retries, synchronized retry storms, fallback returning incorrect data, shared thread/connection pools across unrelated workloads, and health checks that only test process liveness.

## Verification
Run fault injection and confirm latency, error rates, recovery time, and business correctness remain within targets.

## Expected output
A documented resilience strategy with bounded failure behavior and recovery evidence.

## Stop conditions
Stop when fallback semantics could violate business or safety requirements, or dependency guarantees are unknown.