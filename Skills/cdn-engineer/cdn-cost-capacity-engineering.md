# CDN Cost and Capacity Engineering

## Purpose
Control CDN spend while preserving performance, resilience, and origin safety through evidence-based capacity and traffic decisions.

## When to use
Use for budget planning, traffic growth, contract evaluation, architecture changes, or unexpected spend.

## Inputs
Traffic volume, egress bytes, request counts, regions, cache hit ratio, origin egress, feature charges, forecasts, pricing.

## Context to inspect
Billing dimensions, commit tiers, log/compute/security costs, object sizes, cache behavior, origin network costs, peak events.

## Core knowledge
CDN cost is shaped by bytes, requests, geography, optional services, and origin offload. Optimizing price per GB while reducing hit ratio can increase total system cost.

## Procedure
1. Build a unit-cost model by traffic class and region.
2. Reconcile billing with measured bytes and requests.
3. Quantify origin egress and compute avoided by caching.
4. Identify large low-value payloads and poor-hit workloads.
5. Forecast average and peak demand separately.
6. Evaluate compression, TTL, routing, and media optimization impacts.
7. Include resilience headroom and failover capacity.
8. Compare provider/contract scenarios using the same workload model.
9. Set spend anomaly alerts.

## Decision points
Optimize total delivery cost, not CDN invoice alone. Reserve/commit only against credible baseline demand; retain headroom for events and failover.

## Common failure patterns
Ignoring request fees, comparing providers with different regional mixes, sacrificing security/availability for cost, missing origin egress, and planning only average traffic.

## Verification
Reconcile model against invoices, validate forecast with historical peaks, and measure savings after optimization without SLO regression.

## Expected output
A transparent unit-cost model, capacity forecast, optimization backlog, and budget guardrails.

## Stop conditions
Escalate contractual commitments, architecture changes that reduce resilience, or forecasts with materially unreliable demand assumptions.