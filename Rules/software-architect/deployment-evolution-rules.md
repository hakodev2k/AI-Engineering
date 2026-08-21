# Deployment and Evolution Rules

## Purpose
Enable safe software evolution across independently deployed components and environments.

## Scope
Applies to deployment sequencing, compatibility windows, feature flags, rollout, rollback, and service evolution.

## MUST
- Deployments that span multiple components MUST define safe rollout order and compatibility windows.
- Schema and contract evolution MUST support the intended deployment sequence.
- High-impact releases MUST define rollback or forward-fix strategy before execution.
- Feature flags used for migration or risk control MUST define ownership and removal criteria.

## MUST NOT
- MUST NOT require perfectly synchronized deployment unless the operational constraint is explicit and justified.
- MUST NOT remove old contract behavior before dependent consumers have migrated.
- MUST NOT treat rollback as safe when state or schema changes are irreversible.

## SHOULD
- Prefer expand-migrate-contract evolution for persistent schemas and public contracts.
- Prefer progressive delivery for high-risk changes when infrastructure supports it.

## Exceptions
Coordinated cutovers may be used when compatibility is impractical, with human approval and rehearsed recovery steps.

## Verification
Review deployment plans, migration tests, compatibility tests, release telemetry, flags, and rollback drills.