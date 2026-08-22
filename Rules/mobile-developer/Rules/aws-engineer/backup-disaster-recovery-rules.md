# Backup and Disaster Recovery Rules
## Purpose
Ensure data and services can be restored within approved recovery objectives.
## Scope
AWS Backup, snapshots, replication, restore procedures, RPO, RTO, and disaster recovery.
## MUST
- Define RPO and RTO for critical systems and map backup or replication controls to them.
- Protect backups from accidental or malicious deletion according to risk.
- Test restoration using representative data and dependencies, not backup-job success alone.
- Document recovery order, ownership, prerequisites, and decision authority.
## MUST NOT
- Treat replication as a substitute for backup when corruption or deletion can replicate.
- Report recoverability without successful restore evidence.
## SHOULD
- Automate backup policies, retention, copy, and restore testing where practical.
## Exceptions
Recovery gaps require explicit risk acceptance and remediation ownership.
## Verification
Inspect backup policies, vault controls, retention, restore-test evidence, runbooks, RPO/RTO measurements, and recovery exercise results.