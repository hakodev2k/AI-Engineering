# Migration Safety Rules
## Purpose
Change PostgreSQL schemas and data without uncontrolled availability or integrity risk.
## Scope
DDL, backfills, constraint rollout, type changes, and destructive migrations.
## MUST
- Classify migrations by lock, rewrite, duration, compatibility, rollback, and data-loss risk.
- Test high-risk migrations against production-scale representative data.
- Use expand/contract sequencing for changes requiring application compatibility across deployments.
- Obtain human approval before destructive or irreversible production migrations.
## MUST NOT
- Combine destructive cleanup with an unverified deployment dependency.
- Assume transactional DDL makes every migration operationally safe.
## SHOULD
- Backfill in bounded batches with observable progress and pause controls.
## Exceptions
Emergency migrations require incident authority, explicit rollback limits, and post-action validation.
## Verification
Review DDL, lock behavior, rehearsal timings, compatibility tests, backups, and post-migration checks.