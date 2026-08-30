# Cost Optimization and FinOps

## Purpose
Control GCP spend through allocation, rightsizing, commitment strategy, storage lifecycle, query efficiency, and engineering accountability.

## When to use
Use for budget overruns, architecture reviews, idle-resource cleanup, or capacity planning.

## Inputs
Billing export, budgets, labels, workload utilization, growth forecast, business criticality, and commitment inventory.

## Context to inspect
Billing accounts, BigQuery billing export, budgets, Recommender, committed-use discounts, idle resources, reservations, storage classes, and network egress.

## Core knowledge
Cost optimization is a workload-design problem, not only a discount exercise. Commitments should follow stable measured demand, not optimistic forecasts.

## Procedure
1. Ensure cost allocation by project, service, team, and environment.
2. Identify top spend and fastest growth.
3. Separate idle waste from required capacity.
4. Rightsize compute from percentile utilization and SLO needs.
5. Optimize database, BigQuery, storage, and egress patterns.
6. Remove unattached and abandoned resources.
7. Evaluate commitments only for stable baseload.
8. Set budgets and anomaly detection.
9. Track savings without degrading reliability.
10. Revisit cost architecture regularly.

## Decision points
Choose commitments for predictable baseline consumption; preserve on-demand capacity for volatile demand. Optimize architecture before micro-optimizing unit prices.

## Common failure patterns
Buying commitments too early, deleting redundancy needed for SLOs, ignoring egress, and unallocated shared-platform spend.

## Verification
Compare normalized cost per workload unit before and after changes while validating SLOs remain intact.

## Expected output
A prioritized, measurable cost-optimization plan.

## Stop conditions
Stop if savings require violating reliability, security, or retention requirements.