# Migration Safety Rules

## Purpose
Prevent schema and data migrations from causing outages, data loss, or irreversible incompatibility.

## Scope
Database schema changes, data backfills, destructive changes, and deployment sequencing.

## MUST
- Production migrations MUST have compatibility analysis with the currently deployed application versions.
- Destructive changes MUST require explicit approval and a recovery strategy.
- Large backfills MUST be capacity-tested and rate-controlled.
- Expand-and-contract sequencing MUST be used when zero-downtime compatibility requires it.

## MUST NOT
- MUST NOT combine irreversible destructive changes with unverified application rollout assumptions.
- MUST NOT run unbounded table rewrites on critical production data without impact analysis.
- MUST NOT assume rollback is possible after data-destructive migration steps.

## SHOULD
- Migrations SHOULD be small, observable, resumable, and independently deployable.
- Backfills SHOULD be idempotent.

## Exceptions
Emergency migrations require documented incident context, approver, blast-radius assessment, and post-change verification.

## Verification
Inspect migration scripts, lock behavior, staging rehearsals, backup/restore evidence, deployment order, and post-migration checks.