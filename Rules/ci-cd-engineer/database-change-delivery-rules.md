# Database Change Delivery Rules

## Purpose
Prevent release failures and data loss caused by schema or data changes.

## Scope
Migrations, backfills, schema evolution, indexes, and deployment sequencing.

## MUST
- Production database changes MUST have reviewed execution, compatibility, monitoring, and recovery plans.
- Application and schema changes MUST preserve compatibility throughout rolling or phased deployments.
- Destructive or irreversible operations MUST require explicit human approval and verified backup/recovery readiness.
- Large migrations and backfills MUST assess locking, load, duration, and failure resumption.
- Migration identity and outcome MUST be recorded.

## MUST NOT
- MUST NOT combine unbounded destructive SQL with unattended production deployment.
- MUST NOT assume transactional rollback is available for every schema operation.
- MUST NOT remove data or schema still required by any deployed compatible version.

## SHOULD
- Prefer expand-migrate-contract patterns for breaking schema evolution.
- Backfills SHOULD be throttled and resumable.

## Exceptions
Require reason, evidence, alternatives, blast radius, recovery plan, and authorized approval.

## Verification
Review migration SQL/plans, test against production-like data volumes, inspect locks and query impact, exercise recovery, and verify deployment sequencing and approval records.