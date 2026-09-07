# Database Migration Release Rules

## Purpose
Control schema and data changes whose failure can create irreversible corruption, downtime, incompatibility, or extended recovery.

## Scope
Applies to schema migrations, backfills, destructive SQL, data transformations, index operations, and release sequencing involving persistent data.

## MUST
- Database changes MUST identify compatibility assumptions, lock/resource risk, expected duration, data volume, failure modes, and recovery strategy.
- Destructive SQL, data deletion, and irreversible migrations MUST require explicit human approval before execution.
- Application and schema deployment order MUST preserve compatibility across the rollout and rollback window.
- High-volume operations MUST be assessed with representative execution-plan, timing, or production-like evidence where practical.
- Migration completion MUST include integrity and application-health verification.

## MUST NOT
- Destructive changes MUST NOT be bundled with unrelated changes when separation materially improves reversibility.
- A rollback plan MUST NOT claim reversibility when data loss or irreversible transformation prevents restoration.
- Unbounded production backfills MUST NOT be started without resource, throttling, observation, and stop criteria.

## SHOULD
- Expand-and-contract migration patterns SHOULD be used for independently deployed components.
- Large operations SHOULD be chunked, restartable, and observable where supported.

## Exceptions
When online compatibility or rollback is impossible, document reason, alternatives, backup/restore evidence, outage or impact expectations, residual risk, and authorized approval.

## Verification
Review migration scripts, SQL plans or runtime evidence, compatibility tests, backups where required, approval records, sequencing, monitoring, and post-migration integrity checks.