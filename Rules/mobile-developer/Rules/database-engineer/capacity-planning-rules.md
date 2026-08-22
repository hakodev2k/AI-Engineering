# Capacity Planning Rules
## Purpose
Prevent predictable exhaustion of storage, memory, CPU, connections, and throughput.
## Scope
Growth forecasts, headroom, limits, quotas, and scaling triggers.
## MUST
- Track capacity trends for resources capable of causing database unavailability or severe degradation.
- Define actionable thresholds and lead time for scaling or remediation.
- Include expected data growth, workload growth, maintenance overhead, and failure-mode headroom in forecasts.
## MUST NOT
- Plan capacity from average utilization alone when peaks or failover materially change demand.
- Wait for resource exhaustion before defining a scaling path.
## SHOULD
- Validate forecasts against actual growth and revise assumptions periodically.
## Exceptions
Temporary reduced headroom requires documented risk and monitoring.
## Verification
Review utilization trends, forecasts, thresholds, scaling tests, and incident history.