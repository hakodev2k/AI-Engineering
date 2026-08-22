# Configuration and Environment Rules

## Purpose
Prevent environment-specific behavior, secrets, and operational configuration from undermining architecture reliability.

## Scope
Applies to application configuration, feature flags, environment separation, runtime settings, secrets, and deployment-specific behavior.

## MUST
- Environment-specific values MUST be externalized from source code when they vary by deployment context.
- Secrets MUST use approved secret-management mechanisms and MUST NOT be committed to source control.
- Configuration that changes critical behavior MUST have validation, ownership, and safe defaults.
- Production configuration changes with material risk MUST require review and an explicit rollback or recovery path.

## MUST NOT
- MUST NOT encode production-only assumptions inside domain or core application logic.
- MUST NOT rely on undocumented manual configuration as a prerequisite for system correctness.
- MUST NOT log secrets, tokens, or sensitive configuration values.

## SHOULD
- Prefer typed or schema-validated configuration and startup-time validation for required settings.
- Prefer environment parity for behavior that materially affects correctness.

## Exceptions
Local-development shortcuts are acceptable only when isolated from production paths and clearly non-secret.

## Verification
Inspect configuration schemas, secret scanners, deployment manifests, environment diffs, startup validation, and change history.