# Database Migration Rules

## Purpose
Make schema and data evolution safe, compatible, reversible where practical, and observable.

## Scope
Applies to schema migrations, backfills, data transformations, and application/database rollout coordination.

## MUST
- Production migrations MUST be version-controlled, reviewed, and tested against representative schema and data volume.
- Application and schema rollout MUST preserve compatibility across the deployment window.
- Locking, rewrite, storage, runtime, and rollback implications MUST be assessed before high-impact changes.
- Backfills MUST be resumable or safely restartable and MUST expose progress and failure evidence.
- Destructive or irreversible migrations MUST require explicit human approval and verified backups or recovery strategy.

## MUST NOT
- MUST NOT combine destructive cleanup with the first deployment that stops using old data.
- MUST NOT assume a migration safe on empty test data is safe at production scale.
- MUST NOT execute ad-hoc destructive SQL against production without approval and a reviewed plan.

## SHOULD
- Prefer expand-migrate-contract patterns for risky changes.
- Throttle backfills to protect production SLOs.

## Exceptions
Emergency repair migrations require incident authority, bounded scope, backup/recovery consideration, and post-action validation.

## Verification
Run migration tests, lock/runtime estimates, staging rehearsal, schema diff, backup/restore checks, application compatibility tests, and post-deploy integrity queries.