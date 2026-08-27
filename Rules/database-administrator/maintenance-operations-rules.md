# Maintenance Operations

## Purpose
Perform recurring database maintenance without turning routine work into production incidents.

## Scope
Cleanup, vacuuming, compaction, consistency work, log maintenance, housekeeping, and scheduled jobs.

## MUST
- Maintenance tasks MUST have documented purpose, frequency rationale, resource limits, failure handling, and monitoring.
- Jobs that can block, rewrite, or delete significant data MUST be tested and bounded before production use.
- Failed maintenance MUST be surfaced rather than silently retried forever.
- Maintenance windows MUST account for workload peaks, backup overlap, replication, and recovery requirements.

## MUST NOT
- MUST NOT schedule expensive maintenance solely because a generic checklist recommends it.
- MUST NOT allow cleanup jobs to delete data outside an approved retention policy.
- MUST NOT run multiple heavy maintenance operations concurrently without assessing combined resource impact.

## SHOULD
- Maintenance frequency SHOULD be driven by measured need and engine behavior.
- Jobs SHOULD be idempotent or safely restartable where feasible.

## Exceptions
Urgent maintenance outside normal windows requires risk assessment, approval appropriate to impact, and enhanced monitoring.

## Verification
Review schedules, runtime history, resource metrics, retention rules, failure alerts, overlap analysis, and restart behavior.