# Data Integrity Rules

## Purpose
Protect persisted business facts from invalid, contradictory, or orphaned states.

## Scope
Schemas, constraints, reference data, write paths, imports, repairs, and migrations.

## MUST
- Invariants that can be enforced reliably by the database MUST use appropriate constraints rather than application convention alone.
- Primary keys, uniqueness, referential integrity, nullability, and domain constraints MUST match authoritative requirements.
- Integrity changes MUST assess existing data before enforcement.
- Repair operations MUST define affected rows, validation criteria, rollback or recovery strategy, and audit evidence.

## MUST NOT
- MUST NOT disable constraints for convenience without a bounded procedure that validates data before re-enabling them.
- MUST NOT silently discard conflicting records during deduplication or repair.
- MUST NOT assume application validation protects data written by every integration path.

## SHOULD
- Prefer declarative constraints over triggers when both correctly express the invariant.
- Integrity rules SHOULD fail close to the invalid write and expose actionable diagnostics without sensitive data leakage.

## Exceptions
Any invariant intentionally enforced outside the database requires documented ownership, reason, race-condition analysis, and verification evidence.

## Verification
Inspect catalog constraints and foreign keys; run orphan, duplicate, null, and domain-violation checks; test concurrent writes; validate post-migration row counts and invariants. Production repairs require human approval before destructive execution.