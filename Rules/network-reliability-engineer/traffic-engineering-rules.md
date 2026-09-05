# Traffic Engineering Rules

## Purpose
Keep planned traffic shifts evidence-based, capacity-aware, and reversible.

## Scope
Traffic placement, regional balancing, maintenance rerouting, congestion avoidance, and planned path changes.

## MUST
- Planned traffic shifts MUST verify destination capacity before execution.
- Expected source and destination impact MUST be documented for material changes.
- Traffic moves MUST have measurable success criteria and rollback conditions.
- Reliability-sensitive shifts MUST be staged when a gradual approach can reduce blast radius.
- Traffic placement decisions MUST account for dependency and failure-domain constraints.

## MUST NOT
- MUST NOT move traffic based solely on aggregate utilization without checking downstream constraints.
- MUST NOT create a new single failure domain silently.
- MUST NOT continue a shift when required health evidence becomes unavailable.

## SHOULD
- Prefer policies that remain understandable under failure.
- Compare planned and observed traffic distribution after each material change.

## Exceptions
Emergency shifts require incident context, authorized execution, monitoring, and later review.

## Verification
Inspect capacity evidence, traffic metrics, change plans, dependency maps, staged results, and rollback readiness.