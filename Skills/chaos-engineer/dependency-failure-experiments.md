# Dependency Failure Experiments

## Purpose
Validate how a service behaves when an internal or third-party dependency becomes unavailable, slow, inconsistent, or rate limited.

## When to use
Use for critical upstream or downstream dependencies, especially when the service claims fallback, degradation, queuing, or retry behavior.

## Inputs
Dependency map, API contracts, timeout and retry settings, fallback rules, rate limits, SLOs, cache behavior, and incident history.

## Preconditions
The dependency boundary can be simulated or intercepted without affecting unintended consumers.

## Context to inspect
Synchronous calls, asynchronous flows, shared credentials, client libraries, connection pools, caches, queue retention, idempotency, and business-critical dependency paths.

## Core knowledge
Dependency failure is rarely binary. Slow responses, partial errors, stale data, throttling, malformed responses, and intermittent availability can expose different weaknesses. A resilient caller must bound work, preserve correctness, prevent retry amplification, and degrade intentionally.

## Procedure
1. Identify the dependency contract and user capability at risk.
2. Establish baseline call volume and latency.
3. Define the expected degraded behavior.
4. Select a single dependency failure mode.
5. Scope the experiment to controlled callers or traffic.
6. Observe timeout, retry, fallback, and queue behavior.
7. Check for load amplification on the dependency and caller.
8. Verify correctness of cached or fallback data.
9. Measure recovery after dependency health returns.
10. Document gaps in contracts, observability, or resilience controls.

## Decision points
Prefer simulated responses when third-party impact cannot be controlled. Use real failover paths when validating provider redundancy. Choose stale-data scenarios when fallback correctness matters as much as availability.

## Common failure patterns
Unbounded retries; synchronized retry bursts; fallback that is slower than the primary path; stale cache with no safety policy; hidden transitive dependencies; and recovery that requires process restart.

## Verification
Confirm the dependency condition was induced as intended, user-facing behavior matched the hypothesis, and normal behavior returned within the recovery target.

## Expected output
Evidence of dependency resilience, quantified degradation, recovery measurements, and actionable remediation items.

## Stop conditions
Stop if the test could affect unconsenting dependency consumers, violate third-party terms, or exceed defined customer-impact guardrails.