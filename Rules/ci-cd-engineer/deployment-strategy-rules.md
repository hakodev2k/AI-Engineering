# Deployment Strategy Rules

## Purpose
Select deployment mechanics that bound blast radius and preserve recovery options.

## Scope
Rolling, blue-green, canary, recreate, feature-controlled, and equivalent deployment strategies.

## MUST
- Deployment strategy MUST match availability, state, compatibility, and rollback requirements.
- High-risk production changes MUST limit initial blast radius where the platform supports progressive delivery.
- Health criteria and abort conditions MUST be defined before deployment.
- Deployment automation MUST be idempotent or safely resumable.
- Stateful changes MUST be coordinated with application compatibility windows.

## MUST NOT
- MUST NOT use a zero-downtime label without validating actual user-visible availability.
- MUST NOT continue rollout after defined stop conditions are met without explicit human approval.
- MUST NOT assume rollback is safe when schema or external side effects are irreversible.

## SHOULD
- Progressive exposure SHOULD use representative traffic and objective health signals.
- Deployment steps SHOULD be reversible independently where practical.

## Exceptions
Document why the standard strategy is unsuitable, expected blast radius, recovery method, evidence, and approval.

## Verification
Review deployment manifests and runbooks, exercise abort/rollback in a representative environment, inspect health gates, and compare observed rollout metrics with declared criteria.