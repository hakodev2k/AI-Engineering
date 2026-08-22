# High Availability Design

## Purpose
Design cloud workloads to tolerate expected infrastructure and service failures while meeting availability objectives.

## When to use
Use for production services with explicit uptime, continuity, or fault-tolerance requirements.

## Inputs
SLOs, dependency graph, failure domains, traffic, state model, provider SLAs, maintenance behavior.

## Context to inspect
Zones, regions, replicas, load balancers, health checks, databases, queues, caches, DNS, deployment topology.

## Core knowledge
Availability is end-to-end. Redundancy helps only when components fail independently and failover is detected, routed, and tested.

## Procedure
1. Define measurable availability targets.
2. Map critical request paths and dependencies.
3. Identify single points of failure.
4. Distribute components across appropriate failure domains.
5. Design health detection and traffic failover.
6. Protect state with suitable replication and recovery.
7. Add graceful degradation for noncritical dependencies.
8. Plan maintenance and deployment resilience.
9. Test zone/service failures.
10. Compare achieved design against cost and SLO.

## Decision points
Use multi-region only when regional failure risk and business impact justify complexity, data consistency, and cost trade-offs.

## Common failure patterns
Multi-zone compute with single-zone data, health checks that test only process liveness, synchronous dependence on optional services, and untested failover.

## Verification
Inject representative failures and confirm SLO-relevant behavior, not merely component restart.

## Expected output
An availability design tied to failure scenarios and measurable objectives.

## Stop conditions
Escalate when required availability exceeds provider/service capabilities or budget.