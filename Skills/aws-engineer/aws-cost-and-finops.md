# AWS Cost and FinOps

## Purpose
Optimize AWS spend without degrading reliability, security, or delivery velocity.

## When to use
Use for cost reviews, budget overruns, architecture choices, rightsizing, commitment planning, or unit-cost analysis.

## Inputs
Cost and Usage data, tags, workload demand, performance metrics, commitments, business units, growth forecast, SLOs.

## Context to inspect
Cost Explorer, CUR, Savings Plans/Reserved Instances, Spot usage, S3 lifecycle, NAT/data transfer, idle resources, rightsizing recommendations.

## Core knowledge
Cloud cost is architecture. Savings Plans reduce price but add commitment risk. Data transfer, NAT, logging, and idle capacity are frequent hidden drivers. Unit economics are more useful than total spend alone.

## Procedure
1. Establish cost allocation by account, tag, service, and workload.
2. Identify top spend and fastest-growing categories.
3. Correlate cost with utilization and business demand.
4. Remove idle or orphaned resources safely.
5. Right-size compute/database/storage using observed headroom.
6. Reduce avoidable data-transfer and NAT paths.
7. Apply storage lifecycle based on access patterns.
8. Evaluate commitments only after stable baseline analysis.
9. Define budgets/anomaly alerts and accountable owners.
10. Track unit cost over time.

## Decision points
Choose commitments for stable baseline usage; Spot for interruptible capacity; on-demand for uncertain demand. Never trade away redundancy solely for short-term savings without risk acceptance.

## Common failure patterns
Optimizing by list price alone, buying commitments too early, deleting resources without ownership checks, ignoring egress, and cost cuts that violate SLOs.

## Verification
Compare before/after cost and service metrics, confirm no SLO regression, and validate expected savings in billing data.

## Expected output
Ranked optimization plan, savings estimate, risk assessment, and ownership.

## Stop conditions
Escalate when savings require reducing mandated resilience/security or resource ownership cannot be confirmed.