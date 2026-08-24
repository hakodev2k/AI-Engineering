# Model Rollback Rules

## Purpose
Ensure harmful or unstable model releases can be reversed quickly without improvisation.

## Scope
Covers model, serving configuration, feature compatibility, and deployment rollback.

## MUST
- Every production model release MUST have a tested rollback or safe-disable strategy appropriate to its impact.
- Rollback targets MUST be immutable, known-good artifacts with compatible runtime and feature contracts.
- Trigger conditions MUST be defined for critical service, quality, safety, or business regressions.
- Rollback execution MUST preserve audit records and post-rollback verification.

## MUST NOT
- Teams MUST NOT rely on retraining as the only recovery mechanism for a bad release.
- A rollback MUST NOT restore a model whose required feature/schema dependencies are no longer available.
- Incident pressure MUST NOT justify destroying evidence needed for diagnosis.

## SHOULD
- Rollback time objectives SHOULD be established for critical systems.
- Compatibility SHOULD be validated automatically before a release becomes the rollback predecessor.

## Exceptions
If rollback is technically impossible, a tested traffic-disable, fallback, or containment mechanism MUST exist and residual risk MUST be approved before release.

## Verification
Exercise rollback in a representative environment; inspect artifact retention, compatibility checks, trigger definitions, runbooks, permissions, and post-rollback health validation.