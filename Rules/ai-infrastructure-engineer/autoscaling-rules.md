# Autoscaling Rules

## Purpose
Scale AI workloads safely while respecting latency, capacity, and cost constraints.

## Scope
Applies to inference replicas, worker pools, accelerator nodes, queue consumers, and dynamic capacity controls.

## MUST
- Autoscaling policies MUST use workload-relevant signals such as queue depth, concurrency, latency, saturation, or utilization.
- Scale-up and scale-down behavior MUST account for provisioning, model load, checkpoint, and drain time.
- Minimum capacity for critical services MUST reflect failure and traffic assumptions.
- Autoscaling changes MUST be validated under representative burst and recovery scenarios.

## MUST NOT
- MUST NOT scale solely on CPU when accelerator or queue saturation is the actual bottleneck.
- MUST NOT scale down active stateful work without safe drain or checkpoint behavior.
- MUST NOT remove safety headroom solely to improve average utilization.

## SHOULD
- Policies SHOULD include hysteresis or stabilization to prevent oscillation.
- Forecast-based scaling SHOULD be used when startup latency is long and demand is predictable.

## Exceptions
Exceptions require measured evidence, service-risk analysis, rollback, and approval.

## Verification
Review scaling configuration, event history, cold-start timing, burst tests, drain behavior, and SLO impact.