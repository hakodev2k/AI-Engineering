# Autoscaling and Admission Rules

## Purpose
Protect latency and reliability by scaling capacity deliberately and limiting excess work before overload cascades.

## Scope
Replica scaling, accelerator provisioning, queue limits, concurrency limits, rate limits, and overload behavior.

## MUST
- Autoscaling signals MUST correlate with the resource or queue condition that constrains inference capacity.
- Scale-up delays and accelerator provisioning latency MUST be included in capacity planning.
- Admission control MUST reject or defer work before resource exhaustion threatens the serving fleet.
- Queue, concurrency, and request-size limits MUST be explicit for production workloads.
- Overload responses MUST be observable and distinguishable from model execution failures.

## MUST NOT
- MUST NOT allow unbounded queues to substitute for insufficient capacity.
- MUST NOT scale solely on average CPU when accelerator or queue saturation is the actual bottleneck.
- MUST NOT weaken overload protections without explicit review and approval.

## SHOULD
- Prefer predictive or scheduled capacity where demand patterns are known and provisioning is slow.
- Test scale-up and scale-down under burst and cooldown scenarios.

## Exceptions
Temporary limit changes require owner, rationale, expiry, and monitoring.

## Verification
Inspect autoscaling policies, queue limits, overload tests, scaling-event timelines, and saturation metrics.