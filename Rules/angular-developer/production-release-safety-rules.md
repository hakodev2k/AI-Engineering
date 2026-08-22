# Production Release Safety Rules

## Purpose
Prevent frontend releases from causing avoidable outages, broken contracts, unrecoverable client states, or unsafe production changes.

## Scope
Build/release pipelines, deployments, CDN/cache behavior, feature rollout, rollback, and production verification.

## MUST
- Require human approval before production deployment when the project classifies deployment as an approval-controlled action.
- Produce reproducible release artifacts and identify the deployed version in diagnostics.
- Define rollback or forward-fix strategy for material releases, including cache/service-worker implications where applicable.
- Verify critical journeys and telemetry after release using production-safe checks.

## MUST NOT
- Force-push or rewrite shared release history to hide a bad change.
- Weaken security controls, bypass required checks, or modify production configuration without authorized approval.
- Assume CDN/browser caches update atomically.

## SHOULD
- Use staged rollout or feature flags for high-risk behavior when architecture supports safe reversal.

## Exceptions
Emergency changes may use expedited approval paths but must preserve authorization, audit evidence, validation, and retrospective follow-up.

## Verification
Inspect CI/CD evidence, artifact hashes/version, approvals, cache headers, smoke tests, telemetry, and rollback procedure.