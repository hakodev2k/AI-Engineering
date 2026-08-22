# Capacity and Quota Rules
## Purpose
Prevent capacity exhaustion and quota failures from becoming avoidable outages.
## Scope
Service quotas, regional capacity, IP space, storage limits, concurrency, throughput, and resource reservations.
## MUST
- Critical workloads MUST identify hard quotas and capacity constraints on their expected scaling path.
- Capacity plans MUST include peak demand, growth assumptions, failover demand, and provisioning lead time.
- Quota increases required for launches or failover MUST be validated before dependency deadlines.
## MUST NOT
- MUST NOT assume nominal regional capacity guarantees resource availability during recovery or scale events.
- MUST NOT consume shared finite capacity without considering other critical workloads.
## SHOULD
- Alert on approaching quota and capacity thresholds with sufficient lead time for action.
## Exceptions
Exceptions require documented residual risk and contingency plan.
## Verification
Inspect quota dashboards, utilization trends, load forecasts, failover calculations, alerts, reservations, and launch readiness evidence.