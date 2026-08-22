# High Availability and Failover

## Purpose
Engineer network availability so component, link, zone, or provider failures produce understood and tested service behavior.

## When to use
Use for redundant gateways, routing, firewalls, load balancers, WAN links, cloud zones, maintenance planning, or repeated failover incidents.

## Inputs
Availability targets, topology, stateful devices, routing protocols, failure domains, recovery objectives, dependencies, and maintenance constraints.

## Context to inspect
Inspect shared power/provider dependencies, first-hop redundancy, routing convergence, state synchronization, session persistence, DNS TTLs, health probes, and monitoring.

## Core knowledge
Redundant components are not high availability unless failures are independent and failover is automatic or operationally achievable within objectives. Stateful systems add synchronization and split-brain risks.

## Procedure
1. Define service availability and acceptable interruption.
2. Enumerate component and correlated failure scenarios.
3. Identify single points and shared dependencies.
4. Design redundant paths/devices across failure domains.
5. Define detection and convergence mechanisms.
6. Address state synchronization and session behavior.
7. Size surviving paths for degraded load.
8. Create controlled failover tests.
9. Measure interruption and recovery.
10. Document manual fallback and restoration sequence.

## Decision points
Use active-active when capacity utilization and recovery justify complexity; active-standby may be safer for stateful appliances. Faster timers reduce detection time but can increase instability if poorly tuned.

## Common failure patterns
Both paths sharing one carrier, backup under-capacity, untested standby configuration, split brain, failback loops, state loss, and monitoring that misses degraded redundancy.

## Verification
Perform representative component/path failures, measure convergence, confirm session/application impact, validate capacity, and verify alerts.

## Expected output
A tested HA design with failure matrix, convergence expectations, capacity, operational procedures, and evidence.

## Stop conditions
Stop when testing could violate business risk tolerance, shared dependencies cannot be identified, or recovery requires unapproved destructive actions.