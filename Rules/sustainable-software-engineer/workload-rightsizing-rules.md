# Workload Rightsizing Rules

## Purpose
Keep provisioned capacity aligned with demonstrated workload needs while preserving required headroom.

## Scope
Applies to compute instances, containers, serverless limits, databases, queues, and scheduled workers.

## MUST
- Rightsizing decisions MUST use utilization, latency, saturation, and demand-pattern evidence.
- Required resilience headroom and failover capacity MUST be included in sizing decisions.
- Changes that can affect production availability MUST have rollback criteria.

## MUST NOT
- MUST NOT rightsize solely from average utilization when peaks or burst behavior matter.
- MUST NOT reduce capacity below tested reliability thresholds to improve sustainability metrics.

## SHOULD
- Reassess long-lived resources after material workload or architecture changes.
- Prefer elastic capacity where demand variability and platform behavior justify it.

## Exceptions
Exceptions require documented workload characteristics, reliability constraints, and reason the resource must remain overprovisioned.

## Verification
Review utilization distributions, saturation metrics, load tests, scaling history, capacity models, and post-change service-level evidence.
