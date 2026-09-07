# Backup and Restore Rules

## Purpose
Ensure backups are recoverable evidence, not merely completed jobs.

## Scope
Applies to snapshots, backups, catalogs, retention copies, and restore workflows.

## MUST
- Define recovery point and recovery time objectives for protected datasets.
- Test restores regularly using representative data and isolated environments.
- Protect backup metadata, credentials, and deletion controls with least privilege.

## MUST NOT
- Treat backup success status as proof of recoverability.
- Keep the only backup copy in the same failure domain as primary data.
- Delete or shorten protected retention without authorized approval.

## SHOULD
- Maintain immutable or logically isolated recovery copies for critical data.
- Measure actual restore duration and data completeness.

## Exceptions
Any reduced backup protection requires documented business acceptance, duration, mitigation, and restoration plan.

## Verification
Review restore drills, checksum validation, retention configuration, access controls, and achieved RPO/RTO evidence.