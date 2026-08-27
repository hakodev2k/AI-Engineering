# Capacity and Scalability Rules

## Purpose
Ensure APIs have evidenced headroom for expected demand, failure scenarios, and growth.

## Scope
Covers compute, memory, connections, queues, database pools, downstream quotas, and autoscaling.

## MUST
- Critical APIs MUST identify their primary capacity constraints and measurable saturation signals.
- Capacity plans MUST include expected peak demand, growth assumptions, failover conditions, and safety margin.
- Scaling policies MUST be tested for reaction time, stability, and dependency limits.
- Load-test conclusions MUST state workload model, environment differences, bottlenecks, and confidence limits.
- Capacity changes with production impact MUST have rollback or containment plans.

## MUST NOT
- MUST NOT claim scalability from CPU utilization alone.
- MUST NOT assume horizontal scaling solves fixed downstream quotas or serialized bottlenecks.
- MUST NOT run unbounded production load tests without explicit approval and safeguards.

## SHOULD
- Capacity models SHOULD be recalibrated with production telemetry.
- Critical dependencies SHOULD have quota/headroom monitoring aligned with API growth.

## Exceptions
Exceptions require evidence, risk horizon, compensating controls, owner, and review date.

## Verification
Inspect load tests, production saturation metrics, autoscaling history, quota dashboards, failover tests, and capacity forecasts.