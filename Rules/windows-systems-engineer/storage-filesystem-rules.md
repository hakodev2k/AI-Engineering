# Storage and Filesystems

## Purpose
Protect data integrity, availability, capacity, and access on Windows storage.

## Scope
Volumes, NTFS/ReFS, shares, quotas, permissions, encryption, snapshots, and storage dependencies.

## MUST
- Storage changes MUST assess capacity, redundancy, permissions, encryption, backup, and application dependencies.
- File/share permissions MUST follow least privilege and preserve required inheritance intentionally.
- Capacity thresholds for critical volumes MUST be monitored before exhaustion.
- Destructive formatting, partitioning, bulk deletion, or irreversible filesystem changes MUST require human approval.
- Data migration MUST include integrity and completeness validation.

## MUST NOT
- MUST NOT grant broad write access to solve isolated authorization issues.
- MUST NOT rely on snapshots as the sole backup strategy.
- MUST NOT remove encryption or auditing controls merely to simplify migration.

## SHOULD
- Separate data classes with materially different recovery or security requirements.
- Test failover and restoration for critical storage paths.

## Exceptions
Document reason, data scope, risk, compensating controls, recovery, and approval.

## Verification
Inspect ACLs, effective access, capacity, filesystem health, encryption state, backup coverage, migration counts/checksums, and application tests.