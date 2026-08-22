# API Gateway Design

## Purpose
Use gateways deliberately for cross-cutting edge concerns without turning them into hidden business-logic monoliths.

## When to use
Use for external API exposure, routing consolidation, policy enforcement, or gateway reviews.

## Inputs
API topology, consumers, identity model, traffic policies, deployment architecture, and gateway capabilities.

## Context to inspect
Routing, TLS, authentication, rate limits, transformations, caching, observability, and failure dependencies.

## Core knowledge
Gateways are effective for edge concerns such as TLS termination, routing, coarse authentication, quotas, and telemetry. Resource authorization and domain invariants still belong near the owning service.

## Procedure
1. Define gateway responsibilities explicitly.
2. Map routes and ownership.
3. Configure transport and identity policies.
4. Apply rate limits and payload limits.
5. Minimize transformations.
6. Propagate correlation and trusted identity context safely.
7. Design gateway failure and scaling behavior.
8. Test bypass paths and direct-service exposure.
9. Monitor latency added by policies.

## Decision points
Centralize stable cross-cutting policy; keep rapidly changing business rules in services. Use aggregation only when it materially simplifies consumers and has clear ownership.

## Common failure patterns
Business logic in gateway scripts, double authentication inconsistencies, hidden transformations, single-point bottlenecks, and services trusting spoofable headers.

## Verification
End-to-end tests confirm routing, policy enforcement, identity propagation, and behavior during gateway degradation.

## Expected output
A bounded gateway architecture with explicit policy ownership.

## Stop conditions
Escalate if gateway policy conflicts with service security boundaries.