# Network Capacity Planning

## Purpose
Forecast and manage network capacity before saturation causes latency, drops, or failover collapse.

## When to use
Use for growth planning, major launches, bandwidth upgrades, provider selection, or recurring congestion.

## Inputs
Historical throughput, peak percentiles, growth rates, failover scenarios, interface utilization, queue drops, business forecasts, and provider limits.

## Context to inspect
Inspect normal and degraded topology, burst characteristics, regional skew, replication traffic, backup windows, and shared links.

## Core knowledge
Average utilization hides risk. Capacity must cover peak demand plus credible failure scenarios, with headroom for bursts, maintenance, and demand uncertainty.

## Procedure
1. Collect sustained and percentile utilization by critical link.
2. Separate ingress, egress, east-west, and replication patterns.
3. Model growth and seasonality.
4. Recalculate capacity under N-1 or relevant failure states.
5. Identify links whose failover state exceeds safe thresholds.
6. Quantify upgrade lead times and provider constraints.
7. Define headroom targets based on burstiness and criticality.
8. Prioritize upgrades by saturation risk and business impact.
9. Establish recurring review thresholds.

## Decision points
Scale vertically when a simple link upgrade is sufficient; scale horizontally when failure isolation, path diversity, or provider limits justify additional paths.

## Common failure patterns
Planning from averages, ignoring failover load, overlooking provider quotas, assuming linear growth, and treating nominal bandwidth as guaranteed throughput.

## Verification
Compare forecast models with actual recent peaks, test failover capacity where safe, and confirm monitoring alerts before saturation.

## Expected output
A capacity model, upgrade plan, and measurable headroom policy.

## Stop conditions
Escalate when forecasts depend on unavailable business projections or provider commitments cannot be validated.