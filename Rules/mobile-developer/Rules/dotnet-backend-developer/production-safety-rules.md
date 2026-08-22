# Production Safety Rules

## Purpose
Protect production availability, data integrity, customer impact, and recoverability during operational changes.

## Scope
Applies to deployments, configuration, feature activation, destructive operations, incident response, and emergency changes.

## MUST
- Production-impacting changes MUST have a defined verification and rollback or forward-fix strategy.
- Destructive data changes, irreversible migrations, security-control changes, and high-risk configuration changes MUST require explicit human approval.
- Rollouts that can affect many users SHOULD use progressive exposure, feature flags, or equivalent risk controls when feasible.
- Production configuration MUST be validated and managed separately from source-code defaults where appropriate.
- Incident actions MUST preserve evidence needed for root-cause analysis unless immediate safety requires otherwise.
- Emergency fixes MUST receive post-change review and permanent remediation planning.

## MUST NOT
- MUST NOT deploy directly to production solely because local tests pass.
- MUST NOT perform destructive SQL, secret rotation, infrastructure destruction, or breaking public-contract changes without required approval.
- MUST NOT conceal failed deployments by disabling alerts, health checks, or security controls.
- MUST NOT claim recovery until critical functionality and telemetry have been verified.

## SHOULD
- Prefer reversible changes and staged rollout.
- Keep runbooks for recurring high-impact operational procedures.

## Exceptions
Emergency action may shorten normal process only when delay creates greater risk; reason, approver, evidence, and follow-up MUST be recorded.

## Verification
Use deployment checks, smoke tests, health signals, logs, metrics, traces, rollback drills, configuration diffing, and incident review.