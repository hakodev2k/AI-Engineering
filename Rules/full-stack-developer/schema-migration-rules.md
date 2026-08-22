# Schema Migration Rules

## Purpose
Make database evolution safe, compatible, and reversible where practical.
## Scope
Schema, indexes, backfills, data migrations, and deployment ordering.
## MUST
- Assess lock, runtime, data-loss, compatibility, and rollback risks before production migration.
- Separate destructive cleanup from compatibility rollout when deployments can overlap.
- Back up or otherwise protect irreplaceable data before destructive operations.
## MUST NOT
- Execute destructive production migrations without explicit human approval.
- Assume ORM-generated migration safety without review.
## SHOULD
- Prefer expand-migrate-contract patterns for zero-downtime systems.
## Exceptions
Irreversible changes require documented recovery strategy and approval.
## Verification
Review migration SQL, staging rehearsal, timing evidence, backups, and rollback procedure.