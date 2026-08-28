# Change and Release Rules

## Purpose
Control warehouse changes so production data contracts, workloads, and recovery paths remain safe.

## Scope
Applies to SQL releases, models, schemas, orchestration, permissions, warehouse configuration, and major dependency upgrades.

## MUST
- Production-impacting changes MUST have peer review, automated validation, and a defined rollback or forward-fix path.
- Breaking data-contract changes MUST require explicit consumer migration and human approval.
- Large backfills, destructive DDL, and high-risk configuration changes MUST be approved before execution.
- Release verification MUST include data correctness and operational health, not only deployment success.

## MUST NOT
- MUST NOT force-push or rewrite shared production history to bypass release controls.
- MUST NOT disable quality or security gates merely to unblock a release.

## SHOULD
- Prefer small, reversible releases and staged migrations.
- High-risk changes SHOULD be scheduled with clear ownership and rollback authority.

## Exceptions
Emergency releases require documented incident context, approver, scope, and post-release review.

## Verification
Inspect pull-request evidence, CI results, migration plans, approvals, deployment logs, and post-release checks.