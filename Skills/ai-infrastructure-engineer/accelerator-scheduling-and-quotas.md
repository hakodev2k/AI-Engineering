# Accelerator Scheduling and Quotas

## Purpose
Design fair, efficient accelerator scheduling so high-value workloads run predictably without allowing fragmentation or noisy tenants to consume shared capacity.

## When to use
Use for shared GPU clusters, competing teams, queue backlogs, or poor utilization.

## Inputs
Tenant priorities, workload sizes, runtime distributions, accelerator types, SLOs, and utilization data.

## Context to inspect
Scheduler policies, quotas, priorities, preemption, gang scheduling, affinity rules, fragmentation, idle reservations, and queue metrics.

## Core knowledge
GPU scheduling must account for indivisible resources, topology, multi-node gang placement, heterogeneous accelerators, fairness, starvation, and reservation trade-offs.

## Procedure
1. Classify workloads by priority, size, duration, and interruptibility.
2. Define quota units and ownership boundaries.
3. Establish priority and preemption rules.
4. Require gang scheduling for tightly coupled distributed jobs.
5. Use topology-aware placement where communication matters.
6. Track fragmentation and stranded capacity.
7. Define borrowing rules for unused quota.
8. Add queue-time and starvation alerts.
9. Review policy outcomes with production evidence.

## Decision points
Use strict quotas for predictable isolation; elastic borrowing for higher utilization. Preempt only workloads with safe checkpoint/restart behavior.

## Common failure patterns
Static reservations left idle, priority inflation, starvation of long jobs, topology-blind placement, and quota measured only as raw GPU count.

## Verification
Verify fairness, queue time, preemption recovery, utilization, and fragmentation under mixed workloads.

## Expected output
A documented scheduling policy with quotas, priority, borrowing, and preemption behavior.

## Stop conditions
Stop when workload ownership or restart semantics are undefined.