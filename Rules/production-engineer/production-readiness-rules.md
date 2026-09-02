# Production Readiness Rules

## Purpose
Ensure services are safe, supportable, observable, and operable before production exposure.

## Scope
Applies to new services, major features, migrations, and material operational changes.

## MUST
- A production change MUST define ownership, dependencies, failure modes, rollback or recovery actions, observability, capacity assumptions, and support procedures before release.
- Critical user journeys MUST have explicit health signals and verification steps.
- Readiness evidence MUST reflect the production-like configuration and deployment path.
- Known high-severity risks MUST be resolved, mitigated, or explicitly accepted by an accountable human owner.

## MUST NOT
- MUST NOT treat successful compilation, unit tests, or staging deployment alone as production readiness.
- MUST NOT ship a critical component without a defined operator response for likely failure modes.
- MUST NOT hide unresolved production risk behind generic statements such as "monitor after release."

## SHOULD
- Use a repeatable readiness review for high-impact systems.
- Validate operational assumptions with failure testing where practical.

## Exceptions
Exceptions require documented reason, risk, compensating controls, verification plan, expiry or follow-up, and accountable approval.

## Verification
Review release evidence, runbooks, dashboards, alerts, rollback procedures, dependency maps, capacity data, and readiness sign-off before production exposure.
