# Backup and Recovery

## Purpose
Ensure Windows services and configuration can be restored within agreed recovery objectives.

## Scope
System state, file data, configuration, directory services, application dependencies, backup storage, and restoration.

## MUST
- Critical systems MUST have documented RPO/RTO and backups aligned to them.
- Recovery procedures MUST identify dependencies, credentials, media, sequence, and validation criteria.
- Backups MUST be protected from routine administrative compromise and unauthorized deletion.
- Restore capability MUST be tested periodically; backup-job success alone is insufficient evidence.
- Destructive recovery actions affecting production data MUST require human approval.

## MUST NOT
- MUST NOT claim recoverability without successful restore evidence appropriate to the system.
- MUST NOT keep all backup copies within the same failure or trust boundary.

## SHOULD
- Use immutable or offline protection for critical recovery copies.
- Record restoration duration and gaps discovered during exercises.

## Exceptions
Require documented risk, compensating recovery path, owner, deadline, and approval.

## Verification
Inspect backup freshness, retention, access controls, restore-test records, checksums where relevant, recovery timing, and post-restore service/data integrity.