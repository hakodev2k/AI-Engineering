# Database Cost Optimization

## Purpose
Reduce database spend without sacrificing required performance, resilience, security, or recovery capability.

## When to use
Use for cloud cost reviews, rapid storage growth, overprovisioned services, idle replicas, licensing pressure, and architecture planning.

## Inputs
Billing data, resource utilization, workload schedules, storage growth, retention, service tiers, licensing, HA requirements, and performance objectives.

## Context to inspect
Inspect compute utilization distributions, IO, storage classes, backups, replicas, reserved commitments, autoscaling, idle environments, and inefficient workload contributors.

## Core knowledge
Cost optimization is a workload and architecture exercise, not simply downsizing. Database cost often includes compute, storage, IO, backup, replicas, licenses, network, and operational labor.

## Procedure
1. Attribute spend by database, environment, and cost dimension.
2. Map each resource to availability and performance requirements.
3. Identify persistent underutilization and peak constraints.
4. Remove workload waste before reducing critical capacity.
5. Review retention, archival, backup, and replica footprint.
6. Right-size nonproduction and scheduled workloads.
7. Evaluate reservations/commitments only for stable demand.
8. Compare managed tiers and engine alternatives with migration cost included.
9. Load test proposed sizing changes.
10. Monitor cost and service indicators after rollout.

## Decision points
Choose architectural simplification when it reduces both cost and operational burden. Do not remove redundancy required by recovery objectives merely to reduce spend.

## Common failure patterns
Downsizing from average CPU, deleting backups to save cost, ignoring IO/network pricing, and committing long-term before workload stabilization.

## Verification
Compare normalized cost with latency, throughput, error, recovery, and capacity metrics before and after changes.

## Expected output
A prioritized cost plan with savings estimate, risks, validation, and rollback triggers.

## Stop conditions
Stop when savings would violate explicit SLO, RPO/RTO, compliance, or security requirements.