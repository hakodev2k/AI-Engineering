# Database Backup Security Rules

## Purpose
Ensure backups preserve recoverability without becoming a weaker copy of protected production data.

## Scope
Covers full, incremental, logical, snapshot, archive, and cross-region/cross-account database backups.

## MUST
- Backups MUST inherit data-classification protections, including encryption and access control.
- Backup creation, access, restoration, export, retention, and deletion MUST be auditable.
- Restore procedures MUST be tested periodically in an appropriately isolated environment.
- Backup credentials and keys MUST be recoverable without creating uncontrolled standing privilege.
- Retention and deletion MUST align with recovery requirements and applicable data obligations.

## MUST NOT
- Backups MUST NOT be exposed through broader permissions than primary data.
- Restore tests MUST NOT introduce sensitive production data into an inadequately protected environment.
- Backup deletion, retention reduction, or key destruction that can eliminate recovery capability MUST NOT occur without explicit approval.

## SHOULD
- Use immutability or deletion protection for critical recovery points where threat models include ransomware or privileged compromise.
- Separate backup administration from routine database administration where feasible.

## Exceptions
Exceptions require recovery impact analysis, compensating controls, expiry, and accountable approval.

## Verification
Inspect backup policies, storage ACLs, encryption metadata, KMS access, audit events, retention, immutability settings, and documented restore-test evidence.