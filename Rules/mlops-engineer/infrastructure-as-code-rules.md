# Infrastructure as Code Rules

## Purpose
Keep ML infrastructure reproducible, reviewable, least-privileged, and resistant to configuration drift.

## Scope
Covers compute, storage, networking, registries, orchestration, serving infrastructure, and managed ML resources.

## MUST
- Persistent production infrastructure MUST be defined through version-controlled infrastructure as code where supported.
- Plans/diffs MUST be reviewed before high-impact application.
- Environment-specific values MUST be parameterized without embedding secrets.
- State backends MUST be protected against unauthorized access and accidental loss.
- Destructive production infrastructure changes MUST require explicit human approval and a recovery assessment.

## MUST NOT
- Console-only changes MUST NOT become undocumented production dependencies.
- Broad administrative privileges MUST NOT be granted merely to simplify automation.
- Infrastructure destruction MUST NOT execute automatically from untrusted code paths.

## SHOULD
- Drift detection SHOULD identify unmanaged changes.
- Reusable modules SHOULD encode secure defaults and resource policy.

## Exceptions
Emergency manual changes require incident authority, audit evidence, and prompt reconciliation back into code.

## Verification
Review IaC plans, state protections, access policies, drift reports, change history, and production approval records. Compare deployed resources with declared configuration.