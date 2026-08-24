# Disaster Recovery

## Purpose
Restore messaging capability and required data after regional or catastrophic failure.

## Scope
RPO, RTO, backups, replication, metadata recovery, failover, and failback.

## MUST
- Critical messaging services MUST have explicit RPO and RTO targets.
- Recovery procedures MUST cover broker metadata, schemas, security configuration, and message data as applicable.
- Disaster recovery MUST be exercised and measured periodically.

## MUST NOT
- MUST NOT claim recoverability from untested backups or replication alone.
- MUST NOT perform production failover or failback without authorized incident/change control.

## SHOULD
- Automate repeatable recovery while preserving human approval for high-impact transitions.

## Exceptions
Document unmet objectives, business acceptance, and mitigation.

## Verification
Review restore tests, failover exercises, measured RPO/RTO, backup integrity, and runbooks.