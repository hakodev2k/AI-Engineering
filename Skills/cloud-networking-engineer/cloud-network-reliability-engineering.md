# Cloud Network Reliability Engineering

## Purpose
Engineer cloud networks to meet availability objectives through explicit failure-domain, redundancy, capacity, and recovery design.

## When to use
Use for reliability reviews, new critical networks, post-incident remediation, DR planning, or dependency-risk analysis.

## Inputs
SLOs, topology, critical paths, provider SLAs, component redundancy, quotas, capacity, incident history, and recovery procedures.

## Preconditions
Define service-level availability goals and failure assumptions rather than treating redundancy as a binary property.

## Context to inspect
Zone/region placement, gateways, transit, NAT, DNS, load balancers, firewalls, hybrid links, control-plane dependencies, quotas, autoscaling, and monitoring.

## Core knowledge
Redundant components can share hidden failure domains. Reliable design requires survivor capacity, independent paths, convergence, tested failover, and operable recovery. Managed services reduce operational burden but still have documented scope and limits.

## Procedure
1. Map critical end-to-end network paths.
2. Identify single points and correlated failure domains.
3. Define expected failures: instance, appliance, zone, region, provider link, DNS, control plane.
4. Verify redundancy and survivor capacity.
5. Evaluate convergence and state recovery.
6. Remove unnecessary cross-domain dependencies.
7. Establish SLO-aligned monitoring.
8. Create failure-injection tests.
9. Execute safe game days.
10. Feed findings into architecture and runbooks.

## Decision points
Add redundancy when risk reduction exceeds complexity/cost; simplify when redundant layers introduce more failure modes than they mitigate. Choose active-active versus active-passive based on convergence, state, and capacity requirements.

## Common failure patterns
Two links on one carrier/path, standby components with no capacity, DNS as a hidden single point, failover never tested, and recovery requiring unavailable control-plane access.

## Verification
Demonstrate tolerated failures under realistic load, measure convergence and packet impact, and verify monitoring/runbooks lead operators to the correct action.

## Expected output
A reliability assessment, failure-mode matrix, prioritized remediation, test evidence, and recovery runbooks.

## Stop conditions
Stop when destructive failure testing lacks approval, survivor capacity is insufficient, or provider behavior cannot be safely validated without escalation.