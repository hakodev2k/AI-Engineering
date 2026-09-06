# Capacity and Scaling Rules

## Purpose
Maintain sufficient routing and provider capacity for normal growth, bursts, and defined failure scenarios.

## Scope
Concurrency, regional capacity, provider quotas, queues, autoscaling, token throughput, and headroom.

## MUST
- Capacity planning MUST consider request rate, token volume, concurrency, task mix, fallback amplification, and provider quotas.
- Critical routes MUST maintain documented headroom for expected bursts and relevant failure scenarios.
- Scaling changes MUST be validated against representative workloads and bottlenecks.
- Saturation signals MUST be observable before uncontrolled queue growth or timeout cascades.
- Capacity assumptions MUST be revisited after material model, prompt, provider, or workload changes.

## MUST NOT
- MUST NOT assume provider quota equals achievable production throughput.
- MUST NOT rely on fallback capacity that is simultaneously consumed by the same failure scenario.
- MUST NOT remove capacity headroom without risk review.

## SHOULD
- Forecast by workload class and region where demand differs materially.
- Test burst, sustained-load, and fallback scenarios separately.

## Exceptions
Temporary capacity risk requires owner, duration, mitigation, and approval.

## Verification
Inspect load tests, saturation dashboards, quota data, scaling policies, capacity forecasts, and failure-scenario models.