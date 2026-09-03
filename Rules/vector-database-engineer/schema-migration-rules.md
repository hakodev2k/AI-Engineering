# Schema Migration

## Purpose
Change collection schemas, vector fields, metadata, and index contracts without uncontrolled compatibility or data-loss risk.

## Scope
Applies to additive, breaking, online, offline, and backfill-dependent schema changes.

## MUST
- Every migration MUST classify compatibility, data rewrite requirements, expected duration, resource impact, and rollback feasibility.
- Breaking changes MUST use an approved migration and consumer transition strategy.
- Large migrations MUST be tested on representative scale before production execution.
- Backfills MUST be checkpointed, observable, idempotent where practical, and reconciled after completion.
- Irreversible migrations or destructive field/data removal MUST require explicit human approval.

## MUST NOT
- MUST NOT assume a schema change is safe because the control-plane API accepts it.
- MUST NOT remove fields still used by active consumers.
- MUST NOT combine unrelated destructive changes into a migration that cannot be independently validated or rolled back.

## SHOULD
- Expand/migrate/contract patterns SHOULD be used when they reduce compatibility risk.
- Migrations SHOULD support canary validation and progressive rollout.
- Migration artifacts SHOULD document expected query and index effects.

## Exceptions
Exceptions require reason, constraints, evidence, alternatives considered, risk, recovery procedure, and appropriate approval.

## Verification
Review migration plans, consumer inventories, staging tests, scale tests, checkpoints, reconciliation reports, diffs, and rollback drills.