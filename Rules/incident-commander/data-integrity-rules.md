# Data Integrity Rules

## Purpose
Protect correctness and recoverability when incidents may affect persistent data.

## Scope
Applies to corruption, duplication, loss, stale writes, replay, partial transactions, migration failures, and inconsistent replicas.

## MUST
- Treat suspected data corruption or loss as a distinct impact dimension from service availability.
- Stop or contain harmful writes when evidence indicates continued mutation could worsen integrity.
- Require explicit approval before destructive repair, irreversible migration, bulk deletion, or unbounded data correction.
- Preserve backups, snapshots, audit logs, and evidence needed to reconstruct state before invasive repair when feasible.
- Verify repaired data with deterministic checks and business invariants before declaring recovery.

## MUST NOT
- Assume restored availability proves data correctness.
- Run broad corrective SQL without bounded scope, review, rollback or recovery strategy, and verification criteria.
- Overwrite potentially recoverable evidence unnecessarily.

## SHOULD
- Prefer idempotent, resumable, auditable repair procedures.
- Separate customer-visible recovery from long-running reconciliation when safe.

## Exceptions
Immediate containment may precede complete evidence preservation when continued mutation creates greater irreversible harm.

## Verification
Inspect database logs, checksums, invariants, reconciliation reports, backups, approvals, repair scripts, and post-repair validation.