# Configuration Management Rules

## Purpose
Keep runtime configuration controlled, auditable, environment-aware, and safe to change.

## Scope
Applies to application settings, platform configuration, feature configuration, and environment variables.

## MUST
- Production configuration MUST be versioned or otherwise auditable.
- Configuration schemas and required values MUST be validated before deployment.
- Sensitive configuration MUST be separated from non-secret settings and stored securely.
- Changes with service impact MUST include rollback or previous-value recovery.
- Environment-specific differences MUST be intentional and documented.

## MUST NOT
- MUST NOT hide critical configuration only in undocumented manual steps.
- MUST NOT reuse production secrets in lower environments.
- MUST NOT change high-risk production configuration without required review and approval.

## SHOULD
- Prefer declarative configuration and automated validation.
- Prefer defaults that fail safely when mandatory values are absent.

## Exceptions
Emergency manual changes require audit evidence and prompt reconciliation into managed configuration.

## Verification
Inspect configuration repositories, environment diffs, validation logs, audit history, secret references, and rollback records.