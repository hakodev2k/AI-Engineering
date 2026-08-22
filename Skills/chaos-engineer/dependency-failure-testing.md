# Dependency Failure Testing

## Purpose
Validate system behavior when databases, caches, queues, APIs, identity providers, DNS, or other dependencies become slow, unavailable, or incorrect.

## When to use
Use for services whose availability or correctness depends on remote systems.

## Inputs
Dependency map, contracts, timeout/retry policies, fallback behavior, SLOs, and incident history.

## Context to inspect
Review synchronous call chains, shared dependencies, client libraries, connection pools, circuit breakers, caches, queues, and fallback paths.

## Core knowledge
Dependencies fail partially: latency, throttling, stale responses, malformed data, intermittent errors, and asymmetric network behavior can be more revealing than total outage.

## Procedure
1. Rank dependencies by criticality and coupling.
2. Identify expected behavior for each failure class.
3. Inject one bounded failure mode.
4. Observe timeouts, retries, queues, pools, and user impact.
5. Check whether fallback preserves correctness.
6. Verify recovery after dependency restoration.
7. Record hidden coupling and remediation.

## Decision points
Test latency before hard failure when retry storms or pool exhaustion are plausible. Use stubs only for deterministic contract tests; use representative real dependencies for resilience evidence.

## Common failure patterns
Testing only HTTP 500, ignoring slow responses, retries without budgets, stale cache presented as fresh, fallback that bypasses authorization, and recovery requiring restart.

## Verification
Confirm failure was detected, resource use stayed bounded, expected degradation occurred, and normal service resumed without manual repair.

## Expected output
Evidence of dependency resilience and prioritized gaps.

## Stop conditions
Stop if dependency testing risks shared data, uncontrolled external systems, or impact outside the approved boundary.