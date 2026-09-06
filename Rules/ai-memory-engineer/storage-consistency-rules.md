# Storage Consistency Rules

## Purpose
Keep canonical memory records, replicas, indexes, and retrieval views semantically consistent.

## Scope
Primary stores, replicas, vector indexes, search indexes, caches, replication, and write propagation.

## MUST
- The canonical source of truth for each memory class MUST be defined.
- Replication and indexing lag MUST have documented consistency expectations.
- Update and deletion propagation MUST be idempotent or otherwise safe under retries.
- Retrieval MUST handle partially propagated changes according to an explicit policy.

## MUST NOT
- MUST NOT assume secondary indexes are current merely because writes succeeded at the primary store.
- MUST NOT expose deleted records from stale indexes beyond approved propagation windows.
- MUST NOT use eventual consistency where immediate revocation is a safety requirement without a compensating control.

## SHOULD
- Expose propagation lag and reconciliation metrics.
- Run periodic consistency reconciliation across stores and indexes.

## Exceptions
Exceptions require documented consistency model, user impact, safeguards, and approval.

## Verification
Inspect replication settings, reconciliation jobs, deletion tests, lag metrics, and failure-recovery tests.