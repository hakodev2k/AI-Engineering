# Capacity and Cost Rules
## Purpose
Maintain enough headroom for reliability while controlling avoidable Kubernetes infrastructure cost.
## Scope
Node pools, reservations, quotas, utilization, commitments, specialized hardware, and growth planning.
## MUST
- Track allocatable capacity, requested capacity, actual utilization, pending demand, and failure-domain headroom.
- Preserve sufficient capacity for expected failures, rollouts, and scaling events for critical workloads.
- Support material cost-optimization claims with measured utilization and service-impact evidence.
- Review specialized or high-cost capacity for ownership and continued need.
## MUST NOT
- Optimize cost by removing resilience required to meet approved service objectives without stakeholder approval.
- Use average utilization alone to size bursty critical systems.
## SHOULD
- Forecast capacity from demand trends and known product/infrastructure changes.
## Exceptions
Temporary overprovisioning requires rationale and review date.
## Verification
Review capacity dashboards, scheduler events, node-pool configuration, cost reports, forecasts, and resilience tests.