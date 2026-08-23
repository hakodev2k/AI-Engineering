# Scalability and Resilience Design

## Purpose
Design Azure workloads that handle growth and component failures while meeting explicit service objectives.

## When to use
Use for architecture reviews, capacity planning, high-availability design, regional resilience, or recurring overload/failure incidents.

## Inputs
Traffic patterns, SLOs, RTO/RPO, state model, dependencies, quotas, consistency requirements, cost constraints, and failure history.

## Context to inspect
Inspect compute scaling, zones/regions, load balancing, database capacity, queues, caches, rate limits, retry policies, health probes, quotas, and telemetry.

## Core knowledge
Resilience comes from controlled failure behavior, not redundancy alone. Retries can amplify outages; queues can absorb bursts but create backlog; caches improve latency but add consistency and stampede risks. Scale design must include downstream capacity.

## Procedure
1. Define availability, latency, throughput, and recovery objectives.
2. Identify stateful components and single points of failure.
3. Model normal, peak, and failure-mode load.
4. Design horizontal scaling where workload semantics allow it.
5. Add queueing/buffering for bursty asynchronous work.
6. Apply timeouts, bounded retries, circuit breaking, and load shedding at dependency boundaries.
7. Use zones/regions according to failure objectives.
8. Validate quota and downstream capacity.
9. Run load, failover, and dependency-degradation tests.
10. Record residual failure modes and operational responses.

## Decision points
Prefer scale-out for stateless parallel workloads; scale-up when software or licensing limits distribution. Multi-region designs are justified when business objectives exceed single-region capabilities and operational complexity is acceptable.

## Common failure patterns
Retry storms, autoscaling only the frontend, hidden singleton state, no quota planning, active-active without data-consistency design, and health probes that route traffic to unhealthy dependencies.

## Verification
Load beyond expected peak, fail instances/zones/dependencies, measure SLO impact and recovery, and confirm scaling does not overload downstream systems.

## Expected output
A resilience and scaling design tied to measurable objectives, tested failure modes, capacity assumptions, and operational controls.

## Stop conditions
Stop when required availability has no business-approved cost envelope, data consistency constraints are unresolved, or failure testing cannot be performed safely.