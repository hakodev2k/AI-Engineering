# Cost Governance Rules

## Purpose
Control infrastructure spending without sacrificing required reliability, security, or performance.

## Scope
Applies to cloud resources, managed services, storage, networking, observability, and reserved capacity.

## MUST
- Significant infrastructure changes MUST consider expected cost impact.
- Shared and production resources MUST have ownership and tagging or equivalent allocation metadata.
- Unexpected cost growth MUST be investigated using usage and billing evidence.
- Cost optimizations MUST preserve defined reliability, performance, security, and recovery requirements.
- Unused resources with material cost MUST be removed or justified.

## MUST NOT
- MUST NOT reduce redundancy, backups, security, or observability solely to lower cost without explicit risk acceptance.
- MUST NOT claim savings without comparing equivalent usage periods or normalized workloads.
- MUST NOT leave high-cost resources without ownership.

## SHOULD
- Prefer budgets, anomaly detection, right-sizing, lifecycle policies, and commitment discounts when evidence supports them.

## Exceptions
Temporary overprovisioning requires owner, reason, expected duration, and review date.

## Verification
Use billing reports, resource inventory, utilization metrics, budget alerts, ownership metadata, and before/after cost comparisons.