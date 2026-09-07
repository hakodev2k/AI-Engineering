# Data Integrity and Repair Rules

## Purpose
Detect, contain, and safely repair corruption or divergence.

## Scope
Checksums, reconciliation, invariants, duplicate detection, repair jobs, and manual corrections.

## MUST
- Critical data invariants MUST have a detection mechanism proportionate to impact.
- Repair procedures MUST identify authoritative evidence and preserve an audit trail.
- Bulk repair MUST be restartable, rate-limited, observable, and validated on a bounded sample first.
- Ambiguous conflicting records MUST be escalated rather than arbitrarily overwritten.

## MUST NOT
- MUST NOT run destructive repair against production without backup/recovery assessment and approval.
- MUST NOT infer correctness solely from replication convergence.
- MUST NOT hide repaired corruption without recording scope and cause investigation.

## SHOULD
- Automated reconciliation SHOULD be idempotent and produce measurable discrepancy counts.

## Exceptions
Immediate containment may quarantine data before full diagnosis when continued propagation increases harm.

## Verification
Use invariant queries, checksums, reconciliation reports, audit logs, before/after samples, and recovery evidence.