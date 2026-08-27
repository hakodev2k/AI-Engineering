# Multi-Region High Availability

## Purpose
Design gateway deployment and traffic management so regional failures do not become total API outages.

## When to use
Use for multi-region architecture, disaster recovery, failover design, or regional resilience testing.

## Inputs
Availability objectives, regions, DNS/global load-balancing model, data dependencies, certificate and identity dependencies.

## Context to inspect
Regional autonomy, shared control plane, config propagation, upstream locality, session state, health checks, failover timing, capacity headroom.

## Core knowledge
Understand active-active versus active-passive, global traffic steering, regional health, failure domains, configuration consistency, cold-capacity risk, and dependency locality.

## Procedure
1. Map all gateway and external dependencies by region.
2. Identify components whose failure can defeat regional isolation.
3. Choose active-active or active-passive based on cost, RTO, and operational maturity.
4. Keep gateway runtime state disposable and regional where possible.
5. Replicate configuration through a controlled source of truth.
6. Ensure certificates, identity metadata, DNS, and secrets remain available during failover.
7. Reserve enough surviving-region capacity for shifted traffic.
8. Define health signals that represent user-serving ability.
9. Exercise regional evacuation and restoration.
10. Document traffic rebalancing and rollback procedures.

## Decision points
Prefer active-active for low RTO and regularly exercised capacity; active-passive can reduce cost but increases failover uncertainty. Avoid global dependencies in the request path unless their availability exceeds the gateway objective.

## Common failure patterns
Both regions sharing one control-plane dependency, standby without capacity, DNS TTLs incompatible with RTO, config drift, failover to unhealthy upstreams, no restoration plan.

## Verification
Regional failure drills prove traffic shifts within objectives, surviving capacity remains healthy, and configuration/security controls remain intact.

## Expected output
A tested regional resilience design with explicit RTO/RPO-relevant dependencies and failover runbook.

## Stop conditions
Escalate if required availability exceeds what upstream or identity dependencies can provide.