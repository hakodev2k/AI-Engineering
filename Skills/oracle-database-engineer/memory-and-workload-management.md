# Memory and Workload Management

## Purpose
Tune Oracle memory and workload controls to prevent paging, excessive parsing, PGA spills, shared-pool pressure, and unfair resource contention.

## When to use
Use for memory pressure, ORA memory errors, high temp I/O, parse contention, consolidation, or mixed-workload interference.

## Inputs
OS memory metrics, SGA/PGA statistics, AWR/ASH, workload concurrency, temp usage, resource plans.

## Context to inspect
SGA components, PGA aggregate behavior, automatic memory settings, huge pages, cursor sharing, workarea executions, temp spills, Resource Manager plans, and cgroup/VM limits.

## Core knowledge
Database memory competes with OS and other processes. Cache-hit ratios alone are weak tuning signals; allocation should follow workload evidence and avoid host swapping.

## Procedure
1. Establish host memory limits and swapping/page-pressure evidence.
2. Measure SGA component pressure and PGA workarea behavior.
3. Identify SQL causing large memory or temp consumption.
4. Verify concurrency and peak-vs-average patterns.
5. Adjust memory boundaries conservatively and one dimension at a time.
6. Use Resource Manager for workload isolation where contention is business-significant.
7. Reduce parse churn through application/bind improvements where relevant.
8. Validate huge-page and OS settings for the platform.
9. Re-measure DB and host metrics under peak load.

## Decision points
Prefer fixed SGA/PGA boundaries when predictability is critical; use automatic management when platform behavior and operational simplicity justify it.

## Common failure patterns
Chasing buffer-cache ratios, allocating nearly all RAM to Oracle, masking bad SQL with PGA increases, and ignoring VM/container limits.

## Verification
Confirm no swapping, reduced spills/contention, stable response time, and acceptable OS headroom.

## Expected output
A measured memory/workload configuration and capacity rationale.

## Stop conditions
Stop when host-level limits or competing workloads are unknown.