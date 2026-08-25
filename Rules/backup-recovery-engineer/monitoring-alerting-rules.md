# Monitoring and Alerting

## Purpose
Detect protection failures before recovery is needed.

## Scope
Backup jobs, repositories, replication, verification, capacity, immutability, credentials, and recovery readiness.

## MUST
- Monitoring MUST detect missed jobs, failed jobs, stale restore points, repository capacity risk, integrity failures, and broken protection chains relevant to objectives.
- Alerts MUST route to an accountable responder with severity based on recoverability impact.
- Repeated warnings and partial-success states MUST be evaluated rather than treated as success.
- Monitoring itself MUST have health checks or equivalent failure detection.

## MUST NOT
- MUST NOT suppress alerts permanently without documented rationale and replacement detection.
- MUST NOT use aggregate success rates to hide unprotected critical workloads.
- MUST NOT close incidents before recoverability is restored or risk is accepted.

## SHOULD
- Dashboards SHOULD show compliance by workload tier and objective, not only job counts.

## Exceptions
Temporary alert suppression requires owner, reason, duration, compensating monitoring, and expiry.

## Verification
Inspect alert rules, routing, stale-backup detection, sample incidents, suppression records, monitoring health, and workload-level compliance reports.