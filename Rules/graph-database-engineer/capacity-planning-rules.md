# Capacity Planning Rules

## Purpose
Keep graph workloads within safe compute, memory, storage, and operational headroom.

## Scope
Growth forecasting, graph density, storage, memory, CPU, I/O, cache, and cluster capacity.

## MUST
- Forecast both entity count and relationship growth; graph density MUST be considered separately from raw record count.
- Include indexes, transaction logs, replicas, backups, temporary migration space, and algorithm workspaces in capacity estimates.
- Define headroom thresholds and escalation actions before saturation.
- Base scale decisions on measured workload and growth evidence.

## MUST NOT
- Extrapolate capacity from node count alone when relationship density or property size can dominate.
- Plan to operate continuously at resource saturation.
- Schedule large imports, migrations, or algorithms without checking temporary resource requirements.

## SHOULD
- Model multiple growth scenarios and known seasonal peaks.
- Track high-degree-node growth and query concurrency as capacity dimensions.

## Exceptions
Temporary reduced headroom requires explicit duration, monitoring, rollback/degradation plan, and operational approval.

## Verification
Review growth trends, degree distributions, storage composition, memory/cache metrics, peak concurrency, load tests, forecast assumptions, and alert thresholds against actual utilization.