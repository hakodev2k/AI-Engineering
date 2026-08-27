# Multi-Region Cloud Networking

## Purpose
Design cross-region connectivity and traffic management that supports disaster recovery, active-active services, and regional autonomy.

## When to use
Use for multi-region applications, regional DR, data-plane expansion, or cross-region latency/reliability reviews.

## Inputs
Regions, application architecture, RTO/RPO, traffic patterns, data replication, DNS/global load balancing, compliance, latency, and cost.

## Preconditions
Understand application and data failover semantics; networking cannot create application-level regional resilience by itself.

## Context to inspect
Inter-region peering/transit, global load balancers, DNS policies, route domains, firewalls, replicated services, private endpoints, quotas, and telemetry.

## Core knowledge
Cross-region dependencies can defeat regional isolation. Active-active improves utilization/recovery but requires consistent routing, state, data, and operational readiness. Inter-region transfer costs and latency are architectural constraints.

## Procedure
1. Classify dependencies as regional or global.
2. Define regional failure assumptions and recovery objectives.
3. Minimize synchronous cross-region dependencies.
4. Select inter-region routing/transit pattern.
5. Design global ingress and DNS failover.
6. Preserve security segmentation across regions.
7. Plan address space and route summarization.
8. Model capacity after losing a region.
9. Instrument regional and cross-region paths.
10. Test regional isolation, failover, and failback.

## Decision points
Choose active-passive for simpler state/recovery when RTO permits; active-active when availability/latency justify added complexity. Prefer regional egress and dependencies when autonomy matters.

## Common failure patterns
Nominally multi-region services with single-region DNS/control dependencies, insufficient survivor capacity, untested failback, route asymmetry, and hidden transfer costs.

## Verification
Execute controlled region-failure exercises, measure convergence and capacity, confirm routing/security, and validate application SLOs during degraded operation.

## Expected output
A regional connectivity model, failover design, capacity/cost analysis, and tested recovery runbook.

## Stop conditions
Stop when application recovery semantics are undefined, failover tests lack authorization, or surviving-region capacity is demonstrably insufficient.