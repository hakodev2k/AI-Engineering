# Data Performance and Cost Optimization

## Purpose
Improve data workload latency, throughput, and infrastructure cost using measured bottlenecks rather than guesswork.

## When to use
Use when jobs miss SLAs, warehouse bills grow, queries scan excessive data, clusters are unstable, or storage patterns degrade performance.

## Inputs
Runtime metrics, query/job plans, data sizes, resource utilization, billing data, SLAs, and workload schedule.

## Context to inspect
Inspect scan volume, shuffle, skew, partition pruning, file sizes, concurrency, cache hit rates, cluster utilization, queue time, and storage lifecycle.

## Core knowledge
Optimize total workload economics, not one metric. Common levers include data pruning, better algorithms, physical layout, incremental processing, concurrency control, right-sizing, autoscaling, and workload scheduling.

## Procedure
1. Establish baseline latency, throughput, and cost per useful unit.
2. Identify dominant stages and resource dimensions.
3. Remove unnecessary data reads and recomputation.
4. Fix partition, clustering, join, and file-layout problems.
5. Address skew and concurrency bottlenecks.
6. Right-size compute after workload efficiency improves.
7. Separate latency-sensitive and bulk workloads where useful.
8. Apply lifecycle policies to cold data.
9. Benchmark under representative concurrency.
10. Track regression budgets in production.

## Decision points
Buy more compute when the workload is efficient but capacity-bound; redesign when scaling produces poor marginal gains. Precompute only when repeated query savings exceed maintenance cost.

## Common failure patterns
Optimizing averages instead of tail runtime, scaling before reducing scans, caching rarely reused data, tiny files, over-partitioning, and ignoring cost of idle resources.

## Verification
Compare before/after SLA percentiles and cost, inspect plans, validate result equivalence, and observe performance across multiple production cycles.

## Expected output
A measured optimization with quantified performance and cost impact plus regression monitoring.

## Stop conditions
Stop when changes risk correctness, require disruptive platform migration, or cost objectives conflict with explicit reliability requirements without owner approval.