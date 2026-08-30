# Schema Evolution

## Purpose
Enable safe database change without breaking consumers or corrupting data.

## Scope
Columns, tables, constraints, types, indexes, views, contracts, and compatibility-sensitive schema changes.

## MUST
- Schema changes MUST classify backward and forward compatibility for known consumers.
- Breaking changes MUST use staged migration, compatibility windows, or approved coordinated rollout.
- Destructive changes MUST require explicit human approval and verified backups or recovery paths.
- Changes affecting large tables MUST assess lock duration, rewrite behavior, replication impact, and rollback.

## MUST NOT
- MUST NOT drop or repurpose fields while active consumers still depend on prior semantics.
- MUST NOT perform irreversible production schema changes without tested recovery.
- MUST NOT rely on application deployment order that is undocumented or unenforced.

## SHOULD
- Prefer expand-migrate-contract patterns for high-risk changes.
- Schema compatibility SHOULD be checked in CI where practical.

## Exceptions
Exceptions require consumer inventory, risk analysis, rollback evidence, execution plan, and approval.

## Verification
Review migrations, dependency scans, compatibility tests, dry runs, lock estimates, and rollback rehearsal evidence.