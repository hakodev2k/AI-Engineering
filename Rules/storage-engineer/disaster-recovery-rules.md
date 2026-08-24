# Disaster Recovery Rules

## Purpose
Make storage recovery from site, region, control-plane, and large-scale failures predictable.

## Scope
Cross-site protection, failover, failback, recovery sequencing, and disaster exercises.

## MUST
- Critical storage services MUST have documented disaster scenarios, RPO, RTO, dependencies, and recovery ownership.
- Recovery procedures MUST specify ordering, authority, validation, and failback criteria.
- Disaster recovery exercises MUST test realistic dependency loss and record achieved recovery objectives.
- Replication lag and secondary-site readiness MUST be monitored when used for DR.

## MUST NOT
- MUST NOT assume a secondary site is recoverable without testing access, dependencies, credentials, and data consistency.
- MUST NOT perform irreversible failover or failback in production without authorized incident or change control.

## SHOULD
- Automate repeatable recovery steps while retaining explicit gates for destructive or irreversible actions.

## Exceptions
Untested DR paths require documented risk acceptance and a scheduled remediation date.

## Verification
Review DR runbooks, exercise records, replication metrics, dependency checks, failover evidence, and corrective actions.