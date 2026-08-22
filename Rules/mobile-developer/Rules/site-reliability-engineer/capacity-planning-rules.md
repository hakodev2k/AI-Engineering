# Capacity Planning Rules

## Purpose
Ensure systems have sufficient headroom for expected demand, failures, maintenance, and growth.

## Scope
Applies to compute, memory, storage, network, connection pools, quotas, and dependency capacity.

## MUST
- Capacity decisions MUST use measured utilization, growth trends, peak demand, and failure scenarios.
- Critical resources MUST define warning thresholds before hard limits are reached.
- Planned launches and migrations MUST assess capacity impact before execution.
- Capacity models MUST include required redundancy and degraded-mode operation where relevant.
- Quotas and external service limits MUST be tracked for critical dependencies.

## MUST NOT
- MUST NOT size production solely from average utilization.
- MUST NOT assume horizontal scaling solves bottlenecks without validating the constrained resource.
- MUST NOT wait for repeated saturation incidents before establishing capacity ownership.

## SHOULD
- Maintain documented headroom targets for critical resources.
- Use load tests or replay evidence when growth assumptions materially affect risk.

## Exceptions
Reduced headroom requires documented business reason, monitoring, mitigation, and explicit risk acceptance.

## Verification
Review utilization trends, forecasts, quota dashboards, load-test results, scaling behavior, and launch readiness records.