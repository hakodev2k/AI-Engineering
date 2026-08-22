# Dependency Resilience Engineering

## Purpose
Design and validate service behavior when internal or external dependencies become slow, unavailable, inconsistent, or rate-limited.

## When to use
Use when adding a dependency, investigating cascading failures, reviewing timeout/retry behavior, or preparing critical services for production.

## Inputs
Dependency graph, API contracts, latency/error history, quotas, SLAs, retry policies, fallback options, business criticality, and SLOs.

## Preconditions
Critical dependencies and the user journeys they support must be known.

## Context to inspect
Client configuration, connection pools, DNS, retries, timeouts, circuit breakers, queues, caches, fallback data, bulkheads, rate limits, and vendor status behavior.

## Core knowledge
Dependencies fail partially more often than completely. Reliability depends on bounded waiting, controlled retries, isolation, load shedding, graceful degradation, and explicit assumptions. Retries amplify load unless limited by deadlines, jitter, backoff, and retry budgets.

## Procedure
1. Classify each dependency by criticality and failure impact.
2. Measure normal and tail latency.
3. Define end-to-end deadlines and derive per-hop timeouts.
4. Review retryability by operation semantics and idempotency.
5. Add exponential backoff and jitter where retries are justified.
6. Bound concurrency and connection usage.
7. Define graceful degradation or cached fallback where safe.
8. Use circuit breaking or load shedding when continued calls worsen failure.
9. Test slow, failed, rate-limited, malformed, and recovery scenarios.
10. Monitor dependency health separately from local service health.
11. Document operational actions and escalation paths.

## Decision points
Retry transient failures only when enough deadline remains and duplicate effects are safe. Prefer fail-fast for non-retryable errors. Use async buffering when temporary unavailability can be tolerated without violating freshness requirements.

## Common failure patterns
Nested retries, identical timeouts at every layer, unlimited concurrency, retry storms, hidden synchronous dependencies, and fallback behavior that serves dangerously stale data.

## Verification
Inject dependency faults and confirm the service remains bounded, avoids cascading resource exhaustion, surfaces correct user behavior, and recovers without a retry surge.

## Expected output
Dependency resilience policy, timeout/retry settings, degradation strategy, tests, dashboards, and documented assumptions.

## Stop conditions
Escalate when dependency guarantees are unknown, fallback correctness cannot be established, or resilience changes alter business semantics.