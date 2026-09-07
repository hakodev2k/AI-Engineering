# Retention and Data Lifecycle Rules

## Purpose
Control growth, compliance exposure, and deletion risk across distributed copies.

## Scope
TTL, archival, tiering, deletion, tombstones, compaction, backups, and derived copies.

## MUST
- Every high-volume dataset MUST have an intentional lifecycle policy or documented reason for indefinite retention.
- Deletion policies MUST account for replicas, indexes, caches, derived stores, archives, and backup retention.
- TTL or automated deletion MUST be tested against legal holds and business invariants.
- Large deletion waves MUST be capacity-tested for tombstone, compaction, replication, and I/O impact.

## MUST NOT
- MUST NOT enable destructive retention changes in production without impact review and approval.
- MUST NOT assume logical deletion immediately removes all physical copies.
- MUST NOT retain sensitive data longer merely because storage is inexpensive.

## SHOULD
- Archival tiers SHOULD preserve required recoverability while reducing primary-system load.

## Exceptions
Extended retention requires owner, rationale, review date, and compliance alignment.

## Verification
Inspect lifecycle policies, deletion tests, storage trends, compaction metrics, backup policies, and compliance evidence.