# Capacity Planning and Forecasting

## Purpose
Forecast usable storage, performance headroom, and expansion timing before capacity pressure becomes an incident.

## When to use
Use for recurring planning, onboarding large workloads, budget cycles, hardware procurement, cloud commitment planning, and threshold review.

## Inputs
Raw/usable capacity, historical growth, ingest/delete rates, snapshots, replication factors, compression/deduplication ratios, performance utilization, lead times, and business forecasts.

## Context to inspect
Thin provisioning, reserved space, rebuild requirements, quotas, tiering, backup copies, temporary migration space, and vendor/platform limits.

## Core knowledge
Raw capacity is not usable capacity. Replication, erasure coding, filesystem metadata, snapshots, reserved rebuild space, and operational headroom reduce effective capacity. Performance can exhaust before bytes do.

## Procedure
1. Establish authoritative capacity metrics.
2. Separate logical, physical, provisioned, allocated, and usable values.
3. Calculate growth by workload and tier.
4. Model normal, high-growth, and shock scenarios.
5. Include redundancy, snapshot, rebuild, and migration overhead.
6. Forecast both capacity and performance saturation dates.
7. Incorporate procurement or provisioning lead time.
8. Define warning, action, and emergency thresholds.
9. Identify reclamation and tiering opportunities.
10. Publish forecast confidence and assumptions.

## Decision points
Expand early when lead times or rebuild risk are high; reclaim first when waste is material and safe; tier data when access patterns support it. Do not rely on thin provisioning without aggregate oversubscription controls.

## Common failure patterns
Linear forecasts on bursty growth, counting provisioned space as consumed, ignoring snapshots, no rebuild reserve, and alerting only at near-full capacity.

## Verification
Reconcile forecasts against billing/platform metrics, back-test prior forecasts, validate usable-space calculations, and confirm thresholds trigger with enough remediation lead time.

## Expected output
A capacity forecast, saturation dates, confidence bands, expansion/reclamation actions, and threshold policy.

## Stop conditions
Escalate when telemetry is inconsistent, growth drivers are unknown, expansion lead time exceeds remaining headroom, or safety reserve is already breached.