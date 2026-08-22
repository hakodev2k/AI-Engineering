# Cloud Cost and FinOps Optimization

## Purpose
Control cloud spend while preserving reliability, security, and delivery speed.

## When to use
Use for cost reviews, unexpected spend, architecture decisions, budgeting, and capacity planning.

## Inputs
Billing exports, utilization, ownership tags, forecasts, reservations/commitments, workload SLOs.

## Context to inspect
Top services, idle resources, data transfer, storage tiers, autoscaling, licenses, commitments, unit economics.

## Core knowledge
Optimize unit cost and waste, not merely the bill. Cost decisions interact with availability, performance, engineering time, and lock-in.

## Procedure
1. Establish cost allocation and owners.
2. Baseline spend by workload and environment.
3. Identify idle, oversized, orphaned, and unexpectedly growing resources.
4. Analyze compute utilization and scaling.
5. Review storage lifecycle and network transfer.
6. Evaluate commitments only for stable demand.
7. Define budgets and anomaly alerts.
8. Measure cost per useful business unit where possible.
9. Prioritize changes by savings, risk, and effort.
10. Verify savings after implementation.

## Decision points
Rightsize before purchasing commitments. Prefer architectural changes when recurring unit cost dominates and complexity remains acceptable.

## Common failure patterns
Blind shutdowns, commitments based on peak demand, missing tags, ignoring egress, optimizing dev cost while harming reliability, and unverified savings estimates.

## Verification
Compare normalized spend and service SLOs before and after changes.

## Expected output
Prioritized, evidenced cost optimizations with accountable owners.

## Stop conditions
Escalate changes that materially alter resilience, licensing, or contractual commitments.