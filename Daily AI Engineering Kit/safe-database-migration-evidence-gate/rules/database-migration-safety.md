# Database Migration Safety Rules

## MUST
- Generate or inspect actual SQL when the migration framework supports it.
- Record target database engine/version, environment, affected objects, risk level, evidence, recovery strategy, and verification plan.
- Treat production schema or data mutation as an explicit human-approval action.
- Preserve evidence from failed dry-runs/tests instead of overwriting it with a later pass.
- Distinguish reversible, forward-fix-only, and irreversible operations.
- Validate rolling-deployment compatibility when multiple application versions may coexist.
- Reconcile data transformations with measurable invariants or counts.
- Run `scripts/validate-migration-manifest.py` before declaring the package gate ready.
- Report unresolved lock, rewrite, data-loss, compatibility, permission, or recovery risk.

## MUST NOT
- Execute production migrations, destructive SQL, schema changes, or data repairs without explicit human approval.
- Drop/truncate production objects by default.
- Disable constraints, auditing, encryption, authorization, backups, or security controls to make a migration pass.
- Increase database privileges automatically after a permission failure.
- Assume `Down()` or rollback SQL is safe without evidence that changed/lost data can be recovered.
- Mark a migration verified because it compiled, generated SQL, or passed unit tests alone.
- Hide destructive operations inside raw SQL or data scripts that bypass the manifest.
- Use `DELETE`/`UPDATE`/backfill logic without a bounded target, reconciliation plan, or explicit review.
- Retry a failing production migration autonomously.
- Rewrite Git history, remove migration history, or edit already-applied production migration records automatically.

## SHOULD
- Prefer expand-contract patterns for rolling deployments.
- Prefer additive changes before destructive cleanup.
- Use batching/idempotency for large data backfills.
- Keep deployment and migration concerns separately observable.
- Capture representative table size/traffic/lock evidence for operationally sensitive changes.
- Prefer forward-fix over rollback when rollback would itself be destructive.
- Keep migration scripts deterministic and version-controlled.

## Approval boundaries
Human approval is mandatory for production apply, destructive/irreversible operations, downtime, privilege/security changes, breaking application contracts, large-object rewrites, and any accepted unresolved high/critical risk.

## Status integrity
Allowed lifecycle states are `prepared`, `reviewed`, `approved`, `applied`, `verified`, and `blocked`. Agents MUST NOT promote a state unless the evidence required by the workflow exists.