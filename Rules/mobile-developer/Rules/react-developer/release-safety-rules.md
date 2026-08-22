# Release Safety Rules

## Purpose
Protect users from frontend regressions during deployment, feature activation, and rollback.

## Scope
Applies to production releases, feature flags, static asset deployment, cache behavior, and emergency fixes.

## MUST
- Releases affecting critical journeys MUST have explicit pre-release and post-release verification.
- Deployments that can create frontend/backend compatibility windows MUST be designed to tolerate the intended rollout order.
- Breaking client/server contract changes MUST use a coordinated compatibility strategy.
- Feature flags used for risk control MUST define ownership, default state, removal criteria, and safe fallback behavior.
- Rollback or forward-fix strategy MUST consider cached assets, service workers, persisted client state, and API compatibility where relevant.

## MUST NOT
- MUST NOT deploy solely because CI is green when the change has production-specific risk requiring runtime verification.
- MUST NOT remove backward-compatible server behavior before deployed clients no longer depend on it.
- MUST NOT hide failed releases by disabling monitoring, error reporting, or security controls.

## SHOULD
- Prefer progressive rollout for high-impact changes when infrastructure permits it.
- Prefer small independently reversible releases.

## Exceptions
Emergency releases may shorten normal gates only with explicit human approval, recorded reason, verification plan, and follow-up review.

## Verification
Use production smoke tests, release/version telemetry, contract checks, rollback drills where appropriate, asset/cache inspection, and post-release monitoring.