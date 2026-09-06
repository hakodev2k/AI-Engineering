# Configuration and Environment Rules
## Purpose
Prevent environment drift and configuration errors from invalidating readiness evidence.
## Scope
Runtime configuration, feature flags, environment variables, secret references, regions, and environment-specific infrastructure.
## MUST
- Production-critical configuration MUST be versioned, reviewable, or otherwise auditable.
- Validation MUST account for material differences between test and production.
- Required values, valid ranges, defaults, and failure behavior MUST be known.
- Environment-specific security and networking assumptions MUST be validated before launch.
- Production-impacting configuration changes MUST follow change-control and approval appropriate to risk.
## MUST NOT
- Production secrets MUST NOT be stored in source-controlled configuration.
- Routine safe deployment MUST NOT depend on hidden manual configuration steps.
- Test success MUST NOT be treated as sufficient when production configuration differs materially.
## SHOULD
- Validate configuration schemas automatically.
- Prefer declarative configuration and explicit activation controls.
## Exceptions
Manual configuration requires documented rationale, dual verification for high-risk changes, and audit evidence.
## Verification
Compare effective configuration, manifests, secret references, environment diffs, validation output, and change records.