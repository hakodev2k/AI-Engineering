# Configuration and Environment Rules
## Purpose
Prevent unsafe configuration drift and environment coupling.
## Scope
Runtime configuration, environment separation, feature settings, endpoints, and cloud resource parameters.
## MUST
- Environment-specific configuration MUST be externalized from application artifacts where practical.
- Production configuration changes MUST be reviewable, attributable, and recoverable.
- Environment boundaries MUST prevent accidental cross-environment data or resource access.
## MUST NOT
- MUST NOT embed production credentials or environment-specific secrets in deployable artifacts.
- MUST NOT assume non-production behavior proves production configuration correctness.
## SHOULD
- Validate configuration schemas and required values before deployment.
## Exceptions
Exceptions require scope, risk, verification, rollback, and approval.
## Verification
Inspect configuration sources, deployment manifests, environment bindings, access policies, change history, and startup validation.