# Schema Migration Safety

## Purpose
Prevent schema evolution from causing avoidable outages, corruption, or irreversible compatibility failures.

## Scope
DDL, migrations, backfills, constraint changes, type changes, and destructive schema operations.

## MUST
- Production migrations MUST be reviewed for locking, duration, data rewrite, replication, storage, rollback, and application compatibility.
- Destructive or irreversible changes MUST require explicit human approval and a tested recovery strategy.
- Large backfills MUST be bounded, observable, restartable where practical, and designed to avoid uncontrolled contention.
- Breaking changes MUST use an approved compatibility or coordinated-release strategy.

## MUST NOT
- MUST NOT drop or truncate production data structures without verified scope, backup/recovery readiness, and approval.
- MUST NOT assume DDL is instantaneous or nonblocking.
- MUST NOT couple application deployment to an irreversible migration without a failure plan.

## SHOULD
- Expand-and-contract patterns SHOULD be used when independent deployment compatibility is required.
- Migrations SHOULD be rehearsed against representative data volume.

## Exceptions
Emergency schema repair requires incident authority, preserved evidence, and immediate validation.

## Verification
Review migration plans, rehearsal timings, lock tests, compatibility tests, backups, approvals, and post-migration integrity checks.