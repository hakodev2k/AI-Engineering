# Model Deployment Rules

## Purpose
Make model releases controlled, observable, reversible, and separated from artifact creation.

## Scope
Applies to deployment automation, rollout strategies, environment promotion, and production release execution.

## MUST
- Deployment MUST use an immutable approved artifact and versioned configuration.
- Production rollout MUST define health criteria, monitoring window, rollback conditions, and responsible operator.
- High-impact releases MUST use progressive exposure, shadowing, canary, blue/green, or another risk-reducing strategy where feasible.
- Production deployment execution MUST require the authorization defined by the owning organization.
- Deployment records MUST identify model version, configuration, environment, actor, and result.

## MUST NOT
- Training completion MUST NOT directly imply production deployment.
- Production artifacts MUST NOT be rebuilt from unpinned sources during deployment.
- Failed health gates MUST NOT be bypassed silently.

## SHOULD
- Promotion SHOULD reuse the same artifact across environments.
- Rollback SHOULD be automated and regularly exercised.

## Exceptions
Emergency deployment requires explicit incident authority, documented risk, compensating monitoring, and post-event review.

## Verification
Review pipeline gates, deployment records, artifact digests, approvals, rollout telemetry, and rollback evidence. Compare environment manifests to confirm artifact promotion rather than rebuild.