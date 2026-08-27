# Quota and Capacity Rules

## Purpose
Prevent service disruption caused by cloud network limits and exhausted capacity.

## Scope
Applies to route limits, security rules, IPs, NAT ports, load balancer capacity, gateways, peers, tunnels, endpoints, and provider quotas.

## MUST
- Critical network services MUST track quotas and utilization that can constrain growth or failover.
- Capacity planning MUST include normal demand, expected growth, and failure-mode demand.
- Quota increases with long provider lead times MUST be requested before operational headroom becomes unsafe.
- Failover designs MUST verify that standby paths have sufficient capacity for redirected traffic.
- Capacity assumptions MUST be supported by telemetry, tests, documented provider limits, or equivalent evidence.

## MUST NOT
- MUST NOT rely on undocumented soft limits for production design.
- MUST NOT consume reserved recovery capacity for routine workloads without review.
- MUST NOT declare a network scalable solely because resources are cloud-managed.

## SHOULD
- Maintain alert thresholds below hard limits.
- Review limit consumption after major launches and architecture changes.

## Exceptions
Exceptions require documented demand forecast, residual risk, mitigation plan, and owner approval.

## Verification
Review provider quotas, utilization metrics, growth forecasts, load tests, failover capacity evidence, and alert thresholds.