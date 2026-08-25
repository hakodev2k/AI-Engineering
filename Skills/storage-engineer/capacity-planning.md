# Capacity Planning

## Purpose
Forecast usable storage capacity and performance headroom while accounting for growth, redundancy, metadata, snapshots, rebuilds, and operational reserves.

## When to use
Use for quarterly planning, procurement, cloud commitments, onboarding workloads, or before known growth events.

## Inputs
Current utilization, growth history, retention, replication/erasure coding, snapshot behavior, compression/deduplication, workload forecasts, and lead times.

## Preconditions
Use usable rather than raw capacity and define the planning horizon.

## Context to inspect
Pools, tiers, quotas, thin provisioning, reserved capacity, failure-domain layout, rebuild requirements, lifecycle policies, and historical forecast accuracy.

## Core knowledge
Capacity exhaustion can cause severe availability failures. Safe headroom depends on growth variance, failure recovery, rebalance behavior, procurement lead time, and performance degradation near fullness.

## Procedure
1. Establish authoritative current usable capacity.
2. Reconcile logical and physical consumption.
3. Quantify growth by workload and tier.
4. Model retention, snapshots, metadata, and data-reduction ratios conservatively.
5. Reserve capacity for rebuild/rebalance and operational safety.
6. Model base, high-growth, and incident scenarios.
7. Determine trigger thresholds from lead time.
8. Validate that performance capacity also scales.
9. Assign owners and review cadence.

## Decision points
Expand early when lead time or growth uncertainty is high. Reclaim first when waste is demonstrable and safe. Do not rely on thin provisioning without enforceable monitoring and expansion paths.

## Common failure patterns
Planning from raw capacity, assuming compression ratios remain constant, ignoring snapshots, double-counting reclaimable data, and treating performance and space capacity independently.

## Verification
Reconcile forecasts against billing/device reports and validate thresholds through alert tests. Back-test the model against historical growth.

## Expected output
A capacity forecast with assumptions, scenario ranges, safety reserves, expansion dates, thresholds, and owners.

## Stop conditions
Escalate when inventory is inconsistent, growth ownership is unclear, or expansion cannot complete before the safe-capacity threshold.
