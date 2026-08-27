# Capacity and Headroom Rules

## Purpose
Maintain enough usable capacity to survive credible failures, bursts, and recovery operations.

## Scope
Applies to compute, memory, storage, connections, bandwidth, quotas, databases, queues, and external service limits.

## MUST
- Critical resources MUST have measurable capacity limits, utilization signals, and documented headroom targets.
- Capacity planning MUST include the designed fault scenario, not only normal steady-state load.
- Scaling mechanisms MUST account for provisioning delay, warm-up time, quotas, and downstream bottlenecks.
- Capacity changes MUST be supported by measured demand and resource evidence.
- Approaching hard quotas or exhaustion thresholds MUST produce actionable alerts before service impact.

## MUST NOT
- MUST NOT assume average utilization represents safe capacity for bursty or skewed workloads.
- MUST NOT scale one tier without checking whether another tier becomes the limiting resource.
- MUST NOT rely on emergency quota increases as the primary resilience mechanism.

## SHOULD
- Forecasts SHOULD include growth uncertainty and known events.
- Critical services SHOULD retain tested emergency headroom or load-shedding options.

## Exceptions
Lower headroom may be accepted for rapidly elastic, low-impact workloads when scaling behavior is demonstrated under representative load and residual risk is documented.

## Verification
Review capacity dashboards, quotas, load-test evidence, scaling timelines, failure-mode calculations, and historical peaks. Validate surviving capacity after loss of the intended fault domain.