# Cost and Capacity Optimization

## Purpose
Reduce Azure spend while preserving required reliability, security, performance, and delivery flexibility.

## When to use
Use for cost reviews, budget overruns, architecture planning, capacity changes, or recurring underutilization.

## Inputs
Cost exports, budgets, utilization metrics, reservations/savings plans, workload forecasts, SLOs, and ownership tags.

## Context to inspect
Inspect Cost Management, Advisor, resource metrics, SKU/tier configuration, autoscale, idle resources, storage tiers, licensing, commitments, egress, and tagging.

## Core knowledge
Cost optimization is workload optimization, not indiscriminate cutting. Unit economics and utilization over time matter more than a single monthly total. Commitments reduce price but increase forecasting risk.

## Procedure
1. Allocate spend to workloads and owners.
2. Identify top cost drivers and unexpected changes.
3. Compare spend with utilization and business demand.
4. Remove verified idle/orphaned resources safely.
5. Right-size compute and database tiers using representative history.
6. Tune autoscaling and schedules for variable workloads.
7. Apply storage lifecycle and retention optimization.
8. Evaluate reservations/savings plans after stable baseline demand is known.
9. Review network egress and cross-region architecture.
10. Track savings against performance and reliability guardrails.

## Decision points
Use commitments for predictable baseline usage; retain on-demand flexibility for uncertain growth. Prefer architectural efficiency when it removes recurring waste without increasing operational risk.

## Common failure patterns
Downsizing from average CPU alone, buying commitments before right-sizing, deleting unowned resources without dependency checks, optimizing tiny costs while ignoring major egress/database spend, and sacrificing resilience for savings.

## Verification
Compare before/after cost and utilization over a representative period, confirm SLOs and headroom remain acceptable, and validate budget/forecast changes.

## Expected output
A prioritized cost plan with quantified savings, capacity evidence, owners, risks, and post-change validation.

## Stop conditions
Stop when ownership is unknown, savings require violating reliability/security requirements, or capacity data is insufficient to make a safe change.