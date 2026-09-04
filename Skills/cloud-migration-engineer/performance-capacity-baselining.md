# Performance and Capacity Baselining

## Purpose
Establish evidence for target sizing and prove that migration does not introduce unacceptable performance regressions or capacity risk.

## When to use
Use during discovery, target sizing, rehearsal, cutover, and post-migration right-sizing.

## Inputs
CPU, memory, disk, network, database, queue, application latency, throughput, concurrency, error metrics, business seasonality, and SLOs.

## Preconditions
Metrics must cover representative load periods and be attributable to the migration unit.

## Context to inspect
Inspect percentiles, peaks, saturation, working sets, IOPS, throughput, queue depth, connection counts, cache hit rates, autoscaling, batch windows, and known seasonal events.

## Core knowledge
Averages hide migration risk. Sizing should account for peak concurrency, burst behavior, failure headroom, and service limits. Cloud resource units do not map directly to legacy hardware.

## Procedure
1. Define business and technical performance indicators.
2. Collect representative source baselines across normal and peak periods.
3. Identify bottlenecks and existing saturation before migration.
4. Separate current defects from migration acceptance criteria.
5. Map workload demand to candidate target resources.
6. Include HA/failure headroom and scaling limits.
7. Test with production-like volume and concurrency.
8. Compare latency percentiles, throughput, errors, and resource saturation.
9. Tune target configuration based on measured bottlenecks.
10. Establish initial scaling thresholds.
11. Monitor the same indicators during cutover.
12. Right-size after stable production evidence, not immediately from theoretical estimates.

## Decision points
Scale up when single-node constraints or migration simplicity dominate; scale out when workload architecture supports horizontal concurrency. Use autoscaling for variable demand only when startup time and downstream capacity permit it.

## Common failure patterns
Sizing from average CPU; ignoring storage latency; synthetic tests with unrealistic concurrency; no failure headroom; comparing different metrics between source and target; premature cost-driven downsizing.

## Verification
Target meets agreed SLOs under representative and peak tests without unsafe saturation. Production metrics remain within accepted deviation after cutover.

## Expected output
Source baseline, target capacity model, performance comparison, tuning decisions, and post-migration right-sizing criteria.

## Stop conditions
Stop when representative metrics are unavailable, target service limits are exceeded, regression cannot be explained, or load testing risks production stability without approval.