# Migration Safety Rules

## Purpose
Prevent destructive, irreversible, or operationally unsafe database schema changes.

## Scope
Applies to EF Core migrations, SQL migrations, schema evolution, and production rollout.

## MUST
- Every migration MUST be reviewed for data loss, lock duration, table rewrites, compatibility, and rollback implications.
- Destructive changes MUST require explicit human approval and a data preservation strategy.
- Backward-compatible rollout MUST be used when old and new application versions may overlap.
- Large data transformations MUST be separated from schema deployment when doing so reduces risk.
- Migration execution in production MUST be observable and have a defined stop/recovery plan.

## MUST NOT
- MUST NOT drop or rename production data structures casually without confirmed migration impact.
- MUST NOT assume generated migration code is operationally safe merely because it compiles.
- MUST NOT bundle unrelated high-risk schema changes into one opaque migration.

## SHOULD
- Prefer expand-and-contract evolution for breaking schema changes.
- Test migrations against production-like data volumes when lock or duration risk exists.

## Exceptions
Emergency changes require documented risk, approval, backup/recovery evidence, and post-change verification.

## Verification
Review migration SQL, rehearse on representative data, verify backups, test rollback/forward-fix procedures, and inspect production telemetry.