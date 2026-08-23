# Resilience Testing

## Purpose
Verify that systems degrade, recover, and protect data correctly when dependencies or infrastructure fail.

## When to use
Use for distributed systems, critical integrations, retry logic, failover, queues, caches, and availability-sensitive services.

## Inputs
Architecture, dependency SLAs, retry/timeout policies, recovery objectives, failure modes.

## Context to inspect
Inspect timeouts, retries, circuit breakers, idempotency, queues, failover, state consistency, observability, and recovery procedures.

## Core knowledge
Resilience is behavior under failure, not absence of failure. Retries can amplify outages. Recovery correctness and user-visible degradation are first-class requirements.

## Procedure
1. Identify dependency and infrastructure failure modes.
2. Define expected degraded behavior and recovery criteria.
3. Choose safe fault-injection points.
4. Test timeout and partial-response behavior.
5. Test retry limits, backoff, and idempotency.
6. Test dependency unavailability and restoration.
7. Verify state consistency after interruption.
8. Inspect alerts, logs, traces, and operator signals.
9. Validate recovery time and backlog processing.
10. Add durable regression checks for discovered defects.

## Decision points
Use controlled mocks for deterministic edge cases; use environment-level fault injection for system behavior where safe.

## Common failure patterns
Retry storms, infinite waits, silent fallback, duplicate writes, stale recovery assumptions, and testing failure without recovery.

## Verification
Demonstrate expected degradation, bounded resource use, correct recovery, and intact data.

## Expected output
Failure-mode evidence and prioritized resilience gaps.

## Stop conditions
Abort fault injection if blast radius exceeds the approved environment or recovery cannot be guaranteed.