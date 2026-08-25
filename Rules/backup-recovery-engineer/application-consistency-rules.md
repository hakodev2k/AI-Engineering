# Application Consistency

## Purpose
Ensure restored data is transactionally and operationally usable by the application.

## Scope
Databases, transactional services, distributed applications, filesystems, snapshots, and application-aware backups.

## MUST
- Protection methods MUST match the workload's consistency model and supported recovery procedure.
- Crash-consistent backups MUST be explicitly identified when application-consistent recovery is required or preferred.
- Transaction logs, journals, manifests, and dependent state required for point-in-time recovery MUST be protected and validated.
- Restore tests MUST verify application-level correctness, not only filesystem readability.

## MUST NOT
- MUST NOT assume storage snapshots are application-consistent without evidence.
- MUST NOT truncate required logs before their recoverability is confirmed.
- MUST NOT restore mutually dependent components to incompatible points without an approved reconciliation method.

## SHOULD
- Native application backup interfaces SHOULD be preferred when they provide stronger consistency guarantees.

## Exceptions
Exceptions require workload-owner acceptance, documented failure modes, and a tested recovery procedure.

## Verification
Review backup mode, application hooks, log-chain status, vendor support constraints, point-in-time recovery tests, and post-restore application validation.