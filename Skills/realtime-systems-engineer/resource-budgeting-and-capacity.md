# Resource Budgeting and Capacity

## Purpose
Allocate CPU, memory, bandwidth, interrupt, and queue capacity so timing remains predictable with explicit headroom for growth and fault conditions.

## When to use
Use during architecture, hardware sizing, feature admission, overload analysis, or unexplained deadline erosion.

## Inputs
Task budgets, event rates, memory use, network/I/O rates, hardware capacity, growth forecast, criticality.

## Context to inspect
CPU utilization by priority/core, interrupt load, cache/bus contention, memory pools, queue occupancy, I/O bandwidth, and background services.

## Core knowledge
Real-time capacity is not simply average utilization. Headroom must account for bursts, blocking, interference, fault recovery, measurement uncertainty, and future change. Admission control protects critical workloads from overload.

## Procedure
1. Inventory bounded demand for each resource.
2. Attribute demand to criticality and operating mode.
3. Calculate normal, peak, and degraded-mode budgets.
4. Reserve explicit headroom for interference and uncertainty.
5. Define queue and pool limits.
6. Establish feature/workload admission criteria.
7. Identify shared resources that invalidate independent budgets.
8. Test saturation and graceful degradation.
9. Track budget deltas in performance-sensitive changes.

## Decision points
Scale hardware when required bounds cannot be met economically in software; optimize only after evidence identifies a dominant resource. Reject non-critical work before sacrificing critical deadlines.

## Common failure patterns
Sizing from averages, running CPUs near saturation, unlimited queues, double-counting shared capacity, and failing to budget recovery/diagnostics overhead.

## Verification
Measure resource use under peak and fault workloads and confirm critical deadlines survive within documented headroom.

## Expected output
A resource budget table, admission limits, overload priorities, and capacity evidence.

## Stop conditions
Stop when workload ceilings or criticality priorities are undefined enough that safe admission limits cannot be established.