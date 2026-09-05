# Utilization and Fragmentation Analysis

## Purpose
Distinguish genuinely insufficient AI capacity from capacity stranded by scheduler, topology, memory, model-placement, or reservation fragmentation.

## When to use
Use when queues grow despite visible idle accelerators, utilization is uneven, or expansion requests conflict with low fleet-wide averages.

## Inputs
GPU utilization, allocation state, pending jobs, model placement, node topology, memory usage, reservations, scheduler events, pool definitions.

## Preconditions
Telemetry can correlate free resources with unscheduled demand.

## Context to inspect
Scheduler constraints, gang scheduling, taints/labels, topology affinity, MIG/partitioning, reservations, model replicas, maintenance state.

## Core knowledge
Fleet-wide utilization can hide unusable fragments. A job needing eight colocated GPUs cannot consume eight free GPUs scattered across incompatible nodes or pools.

## Procedure
1. Measure allocated, actively used, idle, reserved, and unavailable capacity separately.
2. Inspect pending-work resource shapes.
3. Identify topology and memory constraints.
4. Quantify stranded capacity by cause.
5. Check over-specific labels and reservations.
6. Simulate consolidation or pool changes.
7. Rebalance workloads where safe.
8. Recalculate effective capacity after remediation.

## Decision points
Fix fragmentation before buying hardware when recoverable stranded capacity materially exceeds the shortage. Keep isolation when security, reliability, or SLO requirements justify it.

## Common failure patterns
Using average utilization alone, deleting reservations without understanding purpose, and combining incompatible workloads just to raise utilization.

## Verification
Pending work decreases or effective schedulable capacity increases without violating workload constraints.

## Expected output
A fragmentation report with recoverable capacity, root causes, and prioritized remediation.

## Stop conditions
Escalate when removing fragmentation would violate isolation, compliance, or reliability requirements.