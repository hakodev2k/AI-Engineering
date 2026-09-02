# Configuration Management Rules

## Purpose
Keep production configuration controlled, auditable, validated, and recoverable.

## Scope
Applies to runtime settings, feature configuration, environment variables, service discovery, policy, and infrastructure configuration.

## MUST
- Production configuration MUST have a defined source of truth and change history.
- Configuration changes MUST be validated for syntax, schema, dependencies, and environment before rollout.
- Material configuration changes MUST follow the same risk, approval, and rollback discipline as code changes.
- Environment-specific values MUST be explicitly separated from reusable defaults.

## MUST NOT
- MUST NOT make untracked manual configuration changes in production when a managed path exists.
- MUST NOT store secrets in ordinary configuration repositories or logs.
- MUST NOT assume configuration-only changes are low risk.

## SHOULD
- Prefer typed or schema-validated configuration.
- Detect drift between declared and effective production state.

## Exceptions
Emergency manual changes require authorization, immediate recording, verification, and reconciliation into the source of truth.

## Verification
Inspect configuration repositories, audit history, schema checks, drift reports, approvals, and effective runtime values.
