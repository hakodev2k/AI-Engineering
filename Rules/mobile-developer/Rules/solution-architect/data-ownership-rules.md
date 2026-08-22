# Data Ownership Rules

## Purpose
Preserve authoritative ownership, integrity, lifecycle responsibility, and accountability for business data.

## Scope
Applies to operational databases, analytical copies, caches, search indexes, replicated data, and external systems.

## MUST
- Every critical data domain MUST identify an authoritative system of record.
- Write authority MUST be limited to the owning system unless a controlled shared-write model is explicitly designed.
- Replicated or derived data MUST define synchronization, staleness, correction, and reconciliation behavior.
- Data retention and deletion responsibilities MUST have an owner.
- Data contracts MUST identify sensitivity and classification when relevant.

## MUST NOT
- MUST NOT create multiple competing sources of truth without a defined conflict-resolution model.
- MUST NOT let caches, analytics stores, or search indexes silently become authoritative.
- MUST NOT duplicate sensitive data without business need and protection controls.

## SHOULD
- Minimize copied data and keep provenance visible.
- Prefer domain ownership over database ownership by infrastructure teams alone.

## Exceptions
Transitional dual-write or replication patterns require explicit migration controls and exit criteria.

## Verification
Inspect data flow diagrams, write paths, ownership documentation, replication jobs, reconciliation checks, retention policies, and access controls.