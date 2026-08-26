# Host Performance Baselining

## Purpose
Create workload-aware Linux performance baselines that make regressions and capacity risks measurable.

## When to use
Use before tuning, migrations, upgrades, capacity planning, incident prevention, or performance acceptance.

## Inputs
Workload profile, SLOs, traffic cycles, hardware/VM sizing, resource metrics, and representative test periods.

## Context to inspect
Inspect CPU topology, memory, storage, network, cgroups, kernel, virtualization, application placement, and monitoring resolution/retention.

## Core knowledge
Baselines require distributions and workload context, not isolated averages. Track utilization, saturation, errors, queueing, PSI, latency percentiles, throughput, and seasonality.

## Procedure
1. Define workload units and service objectives.
2. Select resource and application signals tied to failure modes.
3. Capture normal low, typical, and peak periods.
4. Record configuration and capacity with measurements.
5. Analyze percentiles, saturation points, and correlations.
6. Run controlled benchmarks only where production observations are insufficient.
7. Define alert thresholds from risk, not arbitrary percentages.
8. Rebaseline after material architecture or capacity changes.

## Decision points
Use production observation for realism; synthetic tests for controlled comparison. Capacity headroom depends on burstiness, recovery requirements, and scaling lead time.

## Common failure patterns
Average-only dashboards, benchmarking unlike production, ignoring queue depth/PSI, comparing hosts with different workloads, and treating 70% as a universal threshold.

## Verification
Baseline predicts known peaks, identifies saturation before SLO breach, and can distinguish later regressions from workload growth.

## Expected output
Versioned baseline, saturation indicators, capacity headroom, and measurement methodology.

## Stop conditions
Stop when workload is not representative, telemetry is too coarse to support conclusions, or benchmarks could harm shared production services.