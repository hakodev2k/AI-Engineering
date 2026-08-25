# Maintenance, Vacuum, and Compaction Rules
## Purpose
Keep physical database structures healthy without causing avoidable production disruption.
## Scope
Vacuuming, compaction, reorganization, index maintenance, cleanup, and statistics maintenance.
## MUST
- Base maintenance frequency and scope on engine behavior, churn, bloat, fragmentation, and measured impact.
- Budget CPU, I/O, locks, log generation, and replication impact before heavy maintenance.
- Define cancellation or rollback criteria for production maintenance.
## MUST NOT
- Run blanket rebuild or compaction jobs solely on fixed thresholds without workload evidence.
- Schedule resource-intensive maintenance without considering peak demand and recovery windows.
## SHOULD
- Prefer incremental maintenance when it meets objectives with lower operational risk.
## Exceptions
Urgent structural degradation may justify out-of-window maintenance with human approval.
## Verification
Review maintenance telemetry, bloat/fragmentation evidence, job logs, resource impact, and post-maintenance measurements.