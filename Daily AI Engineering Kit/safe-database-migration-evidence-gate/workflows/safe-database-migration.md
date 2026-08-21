# Workflow: Safe Database Migration

## Trigger
A proposed database schema/data migration enters implementation review, PR review, release preparation, or production change planning.

## Entry conditions
- Migration intent is known.
- Migration source exists.
- Target database engine/version and requested target environment are known.

## Required inputs
Migration files/generated SQL, repository context, policy, deployment model, table/data characteristics when known, tests, and available non-production environment evidence.

## Stages

### 1. Context gathering — Migration Analyst
Collect affected objects, application read/write paths, nearby migrations, tests, deployment order, data size/traffic evidence, and existing operational conventions.

Artifact: draft migration manifest.

Checkpoint: if target engine/version or affected objects are unknown, stop.

### 2. Impact analysis — Migration Analyst
Use `skills/migration-impact-assessment.md`. Classify operations and risk. Generate SQL when safely possible.

Artifact: updated manifest and generated SQL reference.

### 3. Deterministic inspection — Hook/script
Run:
```bash
python scripts/inspect-migration.py --migration <sql-file> --policy config/migration-policy.json --output <inspection.json>
```

Checkpoint: scanner operational errors stop. Findings do not automatically prove unsafety, but destructive findings force review/approval requirements.

### 4. Verification/recovery planning — Migration Analyst
Use `skills/migration-verification-planning.md`. Define prechecks, dry-run/staging checks, postchecks, reconciliation, rollout sequence, and rollback/forward-fix strategy.

### 5. Dry-run/staging evidence — Authorized non-production execution
Required for policy risk levels. Preserve command, environment, SQL/version, result, duration, affected-row/reconciliation evidence, and failure logs.

Transient environment failure may be retried once. A migration/test failure is not a transient retry target; return to analysis.

### 6. Manifest validation — Deterministic hook
Run:
```bash
python scripts/validate-migration-manifest.py --manifest <manifest.json> --policy config/migration-policy.json
```

Exit 2 means policy/evidence failure and returns to analyst. Exit 3 stops for malformed/tool error.

### 7. Independent review — Migration Reviewer
Review all evidence and create `templates/migration-review-report.md` output.

- `pass` → approval stage.
- `revise` → analyst revision, maximum policy revision attempts.
- `blocked` → stop.

### 8. Human approval
Mandatory before any production schema/data mutation. Additional approval is required for destructive/irreversible/high-risk operations according to policy.

Approval record must identify approver, scope, time, accepted risks, and exact migration version/hash/reference. If migration changes after approval, approval is stale and must be renewed.

### 9. Pre-apply verification
Re-run deterministic manifest validation and verify that migration artifact, target environment, approved revision, and preconditions match the reviewed state.

Any mismatch stops.

### 10. Apply — External authorized deployment process
This kit does not perform production apply. The deployment/change system owns execution, credentials, transaction strategy, and operational monitoring.

### 11. Post-apply verification
Run planned schema/data/application checks. Record actual result, not just command success.

If verification fails, status is not `verified`. Follow only the pre-approved recovery/forward-fix process.

### 12. Complete
Final status becomes `verified` only after post-apply checks pass and no blocking risk remains.

## Retry rules
- Analyst/reviewer revisions: maximum `max_revision_attempts` (default 2).
- Transient non-production tooling/environment retry: maximum 1.
- Production migration execution: no autonomous retry.
- Post-apply recovery: no autonomous improvisation; use approved recovery path.

## Failure paths
- Permission failure → stop; no privilege escalation.
- Missing generated SQL for high/critical risk → blocked unless an authorized human explicitly accepts the limitation.
- Dry-run differs materially from reviewed SQL → invalidate evidence and return to analysis.
- Same blocking finding after retry limit → blocked with preserved evidence.

## Approval points
Production apply, destructive/irreversible operations, downtime, privilege/security changes, breaking contracts, large-object rewrites, and accepted unresolved high/critical risk.

## Definition of Done
- Manifest validates.
- Inspection evidence exists.
- Required dry-run/staging evidence exists.
- Reviewer says `pass`.
- Required approval applies to the exact reviewed revision.
- Authorized process applied the migration if production execution is in scope.
- Post-apply checks pass.
- Final lifecycle status is `verified`.