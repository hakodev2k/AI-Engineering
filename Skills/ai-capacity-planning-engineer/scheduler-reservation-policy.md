# Scheduler and Reservation Policy

## Purpose
Design capacity allocation, priority, quota, and reservation rules that keep critical AI workloads schedulable without stranding excessive accelerator capacity.

## When to use
Use for shared training clusters, mixed online/offline pools, queue congestion, tenant contention, or persistent reserved-capacity waste.

## Inputs
Workload priorities, resource shapes, deadlines, utilization, queue wait, tenant quotas, preemption tolerance, topology constraints.

## Preconditions
Business-critical and interruptible workloads are classified.

## Context to inspect
Scheduler queues, priorities, gang scheduling, reservations, quotas, preemption, node labels, topology placement, fairness policy.

## Core knowledge
Capacity availability is governed by policy as much as hardware. Reservations protect deadlines but can reduce pooling efficiency; preemption improves utilization but adds checkpoint and restart cost.

## Procedure
1. Classify workloads by urgency, SLO, and preemption tolerance.
2. Measure wait time and utilization by queue.
3. Identify stranded reservation capacity.
4. Define priority and fairness rules.
5. Set reservation expiry and borrowing policies.
6. Enable preemption only for checkpoint-safe workloads.
7. Align quotas with forecast demand.
8. Simulate peak contention.
9. Review policy using queue and starvation metrics.

## Decision points
Use hard reservations for immovable deadlines or critical serving. Prefer borrowable reservations when idle capacity can safely serve lower-priority work.

## Common failure patterns
Permanent reservations with no expiry, priorities that cause starvation, preempting jobs that cannot recover efficiently, and quotas disconnected from demand.

## Verification
Contention tests show critical jobs meet scheduling objectives while idle reserved capacity is minimized.

## Expected output
A scheduler policy with priorities, reservations, borrowing, preemption, quotas, and measurable targets.

## Stop conditions
Escalate when workload ownership or priority cannot be resolved by technical policy.