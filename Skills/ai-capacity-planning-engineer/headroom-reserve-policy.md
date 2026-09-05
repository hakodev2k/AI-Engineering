# Headroom and Reserve Policy

## Purpose
Define how much spare AI capacity must be maintained for demand bursts, failures, deployments, and forecast uncertainty.

## When to use
Use during capacity planning, SLO design, procurement, or after incidents caused by insufficient reserve.

## Inputs
Demand variability, failure domains, growth rate, autoscaling lead time, hardware lead time, SLOs, maintenance patterns.

## Preconditions
Baseline demand and failure scenarios are quantified.

## Context to inspect
Regional failover, maintenance, rolling deployments, quotas, warm pools, hardware repair time, tenant criticality.

## Core knowledge
Headroom is not waste when it protects against slow provisioning, fault recovery, and uncertainty. The right reserve depends on lead time and blast radius.

## Procedure
1. Measure peak-to-average and forecast error.
2. Identify largest credible failure event.
3. Quantify deployment and maintenance overlap.
4. Set reserve by workload tier.
5. Separate hot reserve from slower recoverable capacity.
6. Validate regional failover assumptions.
7. Review reserve after major architecture changes.

## Decision points
Use more hot reserve for strict latency and long provisioning lead times; use elastic reserve when capacity can arrive before SLO breach.

## Common failure patterns
Applying one reserve percentage everywhere, counting unavailable quota as reserve, and consuming disaster reserve for normal growth.

## Verification
Simulations show target workloads survive defined burst and failure scenarios without violating critical SLOs.

## Expected output
A reserve policy with workload tiers, percentages or units, and trigger conditions.

## Stop conditions
Escalate when required reserve exceeds available quota or budget.