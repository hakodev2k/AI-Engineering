# Capacity and Cost Rules

## Purpose
Balance platform performance, headroom, and cost using measurable demand.

## Scope
Applies to shared compute, storage, network, managed services, quotas, scaling, and platform cost allocation.

## MUST
- Capacity decisions MUST use observed demand or justified forecasts.
- Critical shared services MUST maintain documented headroom appropriate to recovery and burst needs.
- Cost-impacting defaults MUST be reviewed for expected workload scale.
- Unbounded consumption paths MUST have quotas, limits, or explicit risk acceptance.

## MUST NOT
- MUST NOT reduce resilience solely to meet cost targets without documenting operational risk.
- MUST NOT claim optimization without before/after cost or utilization evidence.
- MUST NOT allow one tenant to create uncontrolled shared-cost growth.

## SHOULD
- Prefer rightsizing and autoscaling supported by telemetry.
- Expose useful cost signals to platform consumers where actionable.

## Exceptions
Temporary overprovisioning requires purpose, owner, review date, and removal criteria.

## Verification
Use utilization metrics, billing data, quota reports, load tests, capacity forecasts, and change review.