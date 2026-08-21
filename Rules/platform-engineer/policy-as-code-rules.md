# Policy as Code Rules

## Purpose
Enforce platform guardrails consistently through reviewable, testable policy.

## Scope
Applies to infrastructure policy, admission controls, deployment gates, configuration standards, and compliance checks.

## MUST
- Policies MUST be version-controlled and peer-reviewed.
- Enforcement behavior MUST be tested against allowed and denied cases.
- Policy failures MUST produce actionable explanations.
- High-impact policy changes MUST assess affected workloads before rollout.

## MUST NOT
- MUST NOT introduce organization-wide blocking policy without staged validation.
- MUST NOT allow policy bypass without traceable authorization.
- MUST NOT encode secrets or environment-specific private data in reusable policy.

## SHOULD
- Prefer preventive controls for high-risk violations and detective controls where hard blocking creates greater risk.
- Provide local or pre-merge policy validation when practical.

## Exceptions
Emergency bypasses require owner, scope, expiry, risk justification, and follow-up remediation.

## Verification
Use policy unit tests, dry runs, CI checks, admission tests, audit logs, and rollout metrics.