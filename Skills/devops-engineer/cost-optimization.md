# Cloud Cost Optimization

## Purpose
Reduce infrastructure spend without silently increasing reliability, security, or operational risk.

## When to use
Use for FinOps reviews, budget overruns, architecture changes, or resource-rightsizing initiatives.

## Inputs
Billing data, tags, utilization, reservations/commitments, growth forecast, SLOs.

## Context to inspect
Idle resources, overprovisioning, storage tiers, egress, database sizing, autoscaling, discounts, shared-cost allocation.

## Core knowledge
Optimize unit economics and waste, not just total spend. Cost decisions interact with resilience, engineering time, and lock-in. Measure before and after.

## Procedure
1. Establish cost by service/team/environment.
2. Fix tagging/allocation gaps.
3. Identify idle and orphaned resources.
4. Right-size from sustained utilization and peaks.
5. Optimize storage lifecycle and data transfer.
6. Review reserved capacity after baseline stabilizes.
7. Tune autoscaling and non-production schedules.
8. Evaluate managed-service vs operations cost.
9. Set anomaly alerts and budgets.
10. Verify reliability after changes.

## Decision points
Use commitments only for predictable baseline; accept higher spend where redundancy materially reduces business risk; avoid optimizing tiny costs with large engineering effort.

## Common failure patterns
Deleting redundancy, commitments before rightsizing, ignoring egress, cost without ownership, one-time cleanup with no controls.

## Verification
Spend decreases per workload/unit while SLO and capacity checks remain healthy.

## Expected output
Prioritized savings plan with risk, expected impact, and measured results.

## Stop conditions
Stop when proposed savings violate recovery, security, or capacity requirements.