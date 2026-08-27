# Anycast DNS Engineering

## Purpose
Design and troubleshoot anycast DNS so clients reach healthy nearby service instances with stable routing.

## When to use
Global authoritative/recursive DNS, site expansion, route leaks, regional latency, or anycast failover.

## Inputs
Anycast prefixes, BGP topology/policy, DNS nodes, health model, capacity, upstream peers, telemetry.

## Context to inspect
Prefix advertisements, communities, route preference, node health, local withdrawal automation, ECMP, DDoS controls, and regional query distribution.

## Core knowledge
Anycast uses routing to steer clients to one of multiple instances sharing an address. Routing reachability must track service health carefully; route convergence can move large traffic volumes abruptly.

## Procedure
1. Define service and routing failure domains.
2. Allocate stable anycast address/prefix strategy.
3. Establish BGP policy and route filtering.
4. Couple advertisement to robust local service-health criteria.
5. Avoid flapping with hysteresis and manual override.
6. Measure regional latency and query distribution.
7. Validate node/site capacity for shifted traffic.
8. Test service failure, routing failure, and site withdrawal.
9. Monitor route visibility externally.
10. Document DDoS and maintenance procedures.

## Decision points
Use anycast when global latency/resilience justify routing complexity. Withdraw a route on true service unavailability; retain it during partial degradation only if local service remains better than traffic shift risk.

## Common failure patterns
Advertising from unhealthy nodes, unstable health-triggered BGP, no spare failover capacity, route leaks, stateful assumptions, and debugging only DNS while routing is wrong.

## Verification
Confirm global route visibility, expected regional landing, DNS correctness, withdrawal convergence, capacity under failover, and stable recovery.

## Expected output
Anycast topology/policy, health-withdrawal design, failover evidence, and monitoring/runbook.

## Stop conditions
Stop on unexplained route propagation, insufficient failover capacity, missing prefix authorization, or unsafe automated withdrawal behavior.