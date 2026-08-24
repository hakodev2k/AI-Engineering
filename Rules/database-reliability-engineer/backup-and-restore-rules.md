# Backup and Restore Rules

## Purpose
Ensure data can be recovered within approved recovery objectives.

## Scope
Backups, snapshots, logs, retention, restore workflows, and recovery evidence.

## MUST
- Define RPO and RTO for every critical datastore.
- Encrypt backups and restrict restore privileges.
- Test restores on a recurring schedule using representative recovery scenarios.
- Verify backup completeness, retention, and restore integrity independently of backup-job success.

## MUST NOT
- Do not treat an untested backup as recoverable evidence.
- Do not delete the last known-good recovery chain without approved replacement.

## SHOULD
- Maintain automated restore drills and immutable or isolated recovery copies where risk justifies them.

## Exceptions
Any reduced retention or missed restore test requires risk acceptance, owner, expiry, and remediation date.

## Verification
Inspect backup catalogs, restore logs, checksum results, drill reports, access controls, and RPO/RTO evidence.