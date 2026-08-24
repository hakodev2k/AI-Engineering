# Disaster Recovery Rules

## Purpose
Ensure critical databases can recover from regional, platform, or catastrophic failure.

## Scope
Recovery architecture, cross-region copies, dependencies, runbooks, exercises, and business continuity interfaces.

## MUST
- Define disaster scenarios and recovery objectives for critical databases.
- Document dependencies required to restore usable service, not only database files.
- Test disaster recovery end to end on a recurring schedule.
- Validate restored data, connectivity, credentials, and application compatibility before declaring recovery.

## MUST NOT
- Do not treat replication alone as a complete disaster-recovery strategy.
- Do not rely on undocumented operator knowledge for critical recovery steps.

## SHOULD
- Exercise loss of primary region and control-plane access when relevant.

## Exceptions
Untested recovery paths require explicit risk acceptance, owner, expiry, and remediation date.

## Verification
Review DR architecture, exercise reports, RPO/RTO results, dependency inventories, and recovery runbooks.