# Target Capacity Sizing and Cost

## Purpose
Size the target database for current workload, migration overhead, growth, resilience, and sustainable cost.

## When to use
Use during target design and revise after production-scale benchmarks.

## Inputs
Source CPU, memory, I/O, storage, connections, growth, query workload, HA requirements, backup overhead, migration throughput, cloud pricing, and SLOs.

## Core knowledge
Source resource utilization cannot be copied mechanically across engines. Target architecture, storage latency, caching, replicas, managed-service limits, licensing, and backup behavior change capacity needs.

## Procedure
1. Baseline source workload and peak headroom.
2. Separate steady-state workload from migration load.
3. Model storage capacity, IOPS, throughput, memory working set, CPU, and connections.
4. Include HA replicas, backups, maintenance, and failover capacity.
5. Account for expected growth and retention.
6. Identify target service quotas and scaling limits.
7. Benchmark representative workload at proposed size.
8. Test failover or degraded topology capacity.
9. Estimate recurring and migration-specific cost.
10. Define scale triggers based on telemetry.

## Decision points
Scale vertically when simplicity and service limits favor it; scale reads or partition workloads when measured bottlenecks and architecture justify added complexity.

## Common failure patterns
Sizing from average CPU, ignoring I/O and log throughput, no failover headroom, and choosing cheapest tier before benchmarking.

## Verification
Production-like benchmarks meet SLOs with agreed headroom and cost model matches configured resources.

## Expected output
Evidence-backed target sizing, growth model, cost estimate, and scale thresholds.

## Stop conditions
Stop cutover if target capacity cannot sustain peak workload plus required resilience.