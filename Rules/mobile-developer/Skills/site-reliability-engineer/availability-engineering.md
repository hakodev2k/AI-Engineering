# Availability Engineering

## Purpose
Design and evaluate systems so required user journeys remain available despite component failures, maintenance, overload, and dependency degradation.

## When to use
Use during architecture reviews, reliability improvements, capacity changes, dependency onboarding, and investigation of availability incidents.

## Inputs
Architecture, failure history, topology, dependency contracts, traffic characteristics, recovery objectives, and availability targets.

## Context to inspect
Inspect single points of failure, redundancy domains, load balancing, health checks, failover mechanisms, state placement, dependency timeouts, deployment topology, and operational procedures.

## Core knowledge
Availability is an end-to-end property. Redundant components do not guarantee availability when they share failure domains or require unsafe manual failover. Design around expected failures and understand serial versus parallel dependency effects on composite availability.

## Procedure
1. Map the critical request path.
2. Identify failure domains and single points of failure.
3. Quantify dependency availability and recovery characteristics.
4. Review redundancy and traffic-routing behavior.
5. Validate health checks represent actual service readiness.
6. Design graceful degradation where full functionality is unnecessary.
7. Define automatic versus manual failover boundaries.
8. Test representative component and zone failures.
9. Measure recovery time and user impact.
10. Record residual risks and operational requirements.

## Decision points
Prefer active-active when fast failover and traffic distribution justify complexity. Use active-passive where state, cost, or consistency make active-active inappropriate. Choose graceful degradation when partial service provides meaningful value without violating correctness.

## Common failure patterns
Redundancy inside one failure domain, health checks that only test process liveness, synchronous dependency chains, failover never tested, hidden shared databases, and retries that amplify outages.

## Verification
Demonstrate expected behavior under component, instance, zone, and dependency failures; verify recovery against objectives and inspect user-visible error rates during tests.

## Expected output
Availability assessment, failure-domain map, mitigation plan, tested failover behavior, and documented residual risk.

## Stop conditions
Escalate when recovery requires destructive operations, architecture cannot meet committed targets, or a critical dependency has no viable resilience strategy.