# Production Release Safety Rules

## Purpose
Reduce user impact from frontend deployments and preserve a safe recovery path.

## Scope
Builds, configuration, deployment, feature flags, cache/CDN behavior, rollback, and production verification.

## MUST
- Production artifacts MUST be built from reviewed source through the approved pipeline with environment-specific configuration validated separately from source secrets.
- Releases MUST define verification for critical journeys and a recovery/rollback strategy proportional to impact.
- Breaking frontend/backend contract changes MUST use compatible rollout ordering or coordinated downtime explicitly approved.
- Cacheable assets MUST use versioning/invalidation that prevents incompatible HTML and JavaScript combinations where applicable.
- High-risk production configuration changes or releases MUST require authorized human approval before execution.

## MUST NOT
- Secrets MUST NOT be embedded into build-time frontend environment variables when they will become public bundle content.
- Production fixes MUST NOT rely on untracked manual source modification.
- Rollback MUST NOT be assumed safe when backend/data contracts have already become incompatible.

## SHOULD
- Use progressive delivery or feature flags for risky user-facing changes when infrastructure supports safe control.
- Monitor errors and critical performance immediately after release.

## Exceptions
Emergency release paths require documented authority, minimized scope, evidence of necessity, and retrospective reconciliation.

## Verification
Inspect build provenance, config, deployment records, cache headers, smoke tests, telemetry, approvals, and rollback readiness.