# Backup and Recovery Rules
## Purpose
Make data recovery a verified capability rather than an assumption.
## Scope
Backups, snapshots, point-in-time recovery, restore testing, RPO, and RTO.
## MUST
- Define required RPO and RTO for governed databases with business owners.
- Verify backup success and perform periodic restore tests to an isolated environment.
- Protect backup credentials, encryption keys, and retention according to data sensitivity.
## MUST NOT
- Treat successful backup jobs as proof that restoration works.
- Delete the last known recoverable copy during maintenance or migration.
## SHOULD
- Automate restore validation and record achieved recovery times.
## Exceptions
Any reduced recovery protection requires explicit risk acceptance and expiration.
## Verification
Inspect backup status, restore-test evidence, retention, encryption, recovery runbooks, and measured RPO/RTO.