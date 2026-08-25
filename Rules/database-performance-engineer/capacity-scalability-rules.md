# Capacity and Scalability Rules
## Purpose
Maintain sufficient headroom and choose scaling actions from measured constraints.
## Scope
Compute, memory, storage, connections, throughput, growth, and scaling limits.
## MUST
- Forecast capacity from historical growth, peak demand, failure scenarios, and planned workload changes.
- Identify the actual limiting resource before recommending scale-up or scale-out.
- Define thresholds that leave operational headroom for failover, maintenance, and bursts.
## MUST NOT
- Treat hardware scaling as a substitute for correcting severe query or schema inefficiency without trade-off analysis.
- Plan capacity from average utilization alone.
## SHOULD
- Validate forecasts periodically against actual growth and saturation behavior.
## Exceptions
Emergency scaling may precede root-cause work when availability is threatened.
## Verification
Review utilization history, saturation metrics, forecasts, load tests, cost estimates, and failure-capacity calculations.