# Backup and Restore Rules
## Purpose
Ensure PostgreSQL data can be recovered to required objectives.
## Scope
Physical/logical backups, WAL archiving, PITR, retention, and restore testing.
## MUST
- Define RPO/RTO and map backup architecture to those objectives.
- Encrypt and access-control backup material containing sensitive data.
- Test restores regularly through the full recovery path.
- Verify WAL/archive continuity when PITR is required.
## MUST NOT
- Claim recoverability from backup-job success alone.
- Delete the last known recoverable copy during maintenance.
## SHOULD
- Automate restore verification and retention checks.
## Exceptions
Retention exceptions require data-owner and risk approval.
## Verification
Perform restore drills, checksum/consistency checks, recovery timing, and backup inventory review.