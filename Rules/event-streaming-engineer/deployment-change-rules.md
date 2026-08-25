# Deployment and Change Rules

## Purpose
Deploy streaming changes without accidental contract breaks, duplicate processing, state loss, or uncontrolled blast radius.

## Scope
Applies to application releases, topology changes, broker configuration, schemas, client upgrades, and rollout strategy.

## MUST
- Each production change MUST identify contract, state, offset, ordering, capacity, and rollback implications relevant to the change.
- Stateful or contract-affecting releases MUST define migration sequencing before deployment.
- Rollouts MUST use observable health gates and a bounded blast radius when the platform permits.
- Rollback feasibility MUST be validated; incompatible state/schema changes MUST not be labeled rollback-safe without evidence.
- Production deployment and high-risk broker configuration changes MUST require human approval.

## MUST NOT
- MUST NOT combine unrelated high-risk topology, schema, and infrastructure migrations without a justified need.
- MUST NOT force-reset offsets or state as a routine deployment technique.
- MUST NOT deploy breaking contracts before affected consumers are migrated or isolated.
- MUST NOT use force push/history rewriting as a release shortcut without explicit authorization.

## SHOULD
- Backward-compatible expand/migrate/contract sequences SHOULD be preferred.
- Canary consumers/producers SHOULD be used when they provide meaningful production validation.

## Exceptions
Emergency changes require incident linkage, bounded scope, approval, live monitoring, and post-change verification.

## Verification
Review diffs, migration plans, compatibility checks, rollout telemetry, state/offset continuity, and rollback exercises.