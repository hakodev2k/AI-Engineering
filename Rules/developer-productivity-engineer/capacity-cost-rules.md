# Capacity and Cost Rules
## Purpose
Scale developer infrastructure economically without degrading feedback loops.
## Scope
CI workers, remote execution, caches, artifact storage, and shared platform services.
## MUST
- Capacity decisions MUST use demand, queueing, saturation, reliability, and cost evidence.
- Cost optimizations MUST quantify developer latency or reliability impact before broad rollout.
- Resource limits MUST fail predictably and expose actionable saturation signals.
- Large commitment or infrastructure changes MUST follow applicable approval policy.
## MUST NOT
- MUST NOT reduce capacity based only on average utilization when peak queues affect critical workflows.
- MUST NOT delete artifacts or caches with compliance or recovery value without retention review.
## SHOULD
- Elastic capacity SHOULD target queue latency and workload class rather than raw utilization alone.
## Exceptions
Temporary capacity changes require owner, duration, expected impact, and monitoring.
## Verification
Review utilization distributions, queue latency, cost trends, retention settings, and before/after workflow metrics.