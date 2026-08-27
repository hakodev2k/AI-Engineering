# Cloud Network Cost Optimization

## Purpose
Reduce cloud network spend without degrading reliability, security, or performance.

## When to use
Use for cost reviews, unexplained data-transfer growth, architecture changes, or optimization of NAT, transit, load balancing, inter-region, and egress costs.

## Inputs
Billing data, traffic volumes, topology, transfer pricing, NAT/transit/LB usage, regions/zones, private endpoints, and SLOs.

## Preconditions
Allocate network costs to actual traffic paths and owners before recommending changes.

## Context to inspect
Cross-zone/region bytes, internet egress, NAT processing, transit processing, load balancer capacity, idle public IPs/endpoints, private links, CDN, and provider pricing.

## Core knowledge
Cloud network pricing is path-dependent. A cheaper nominal component can increase transfer or operational cost elsewhere. Optimization must preserve failure-domain independence and security controls.

## Procedure
1. Establish cost baseline by service/path/team.
2. Rank largest cost drivers by bytes and unit price.
3. Trace expensive flows end to end.
4. Identify avoidable hairpins, public paths, and cross-zone/region transfer.
5. Evaluate private endpoints, CDN/caching, topology, and data-locality changes.
6. Check idle/overprovisioned networking resources.
7. Model savings and reliability/performance impact.
8. Implement one controlled optimization at a time.
9. Measure actual post-change cost and SLOs.
10. Add cost anomaly monitoring.

## Decision points
Optimize topology only when savings exceed complexity/risk. Prefer caching/CDN when repeated payload delivery dominates; prefer locality when cross-region data movement is structural.

## Common failure patterns
Disabling redundancy to save transfer cost, ignoring per-byte processing fees, optimizing list price rather than bill, moving traffic through longer paths, and claiming projected savings as realized savings.

## Verification
Compare normalized before/after billing and traffic, confirm SLO/security/reliability unchanged, and validate no new hidden transfer path appeared.

## Expected output
A cost-driver analysis, prioritized optimizations, quantified trade-offs, implemented savings, and monitoring.

## Stop conditions
Stop when billing attribution is insufficient, optimization reduces required resilience/security, or pricing assumptions cannot be validated.