# Cost Management Rules

## Purpose
Control Azure spend without compromising required reliability, security, or performance.

## Scope
Budgets, reservations, savings plans, rightsizing, storage tiers, scaling, licensing, tagging, and cost allocation.

## MUST
- Establish cost ownership and budget visibility for material production workloads.
- Measure actual utilization before rightsizing critical resources.
- Evaluate cost impact when selecting service tiers, redundancy, retention, and scaling strategies.
- Detect abandoned or unexpectedly growing resources and spend.
- Include operational labor and risk when comparing architecture costs.

## MUST NOT
- Reduce resilience, backup, logging, or security controls solely to meet an unreviewed cost target.
- Claim savings without comparing equivalent workload behavior and risk.
- Purchase long-term commitments without validated baseline demand and ownership.

## SHOULD
- Use budgets, anomaly detection, and recurring cost reviews.
- Prefer elasticity where workload shape and service economics support it.

## Exceptions
Intentional overspend requires business rationale and accountable approval.

## Verification
Review Cost Management reports, budgets, utilization, commitments, tags, anomaly alerts, and before/after cost evidence.