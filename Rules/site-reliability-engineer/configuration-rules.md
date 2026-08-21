# Configuration Rules

## Purpose
Prevent configuration changes from becoming hidden, unreviewed sources of production failure.

## Scope
Applies to runtime configuration, feature flags, environment settings, quotas, routing, and operational parameters.

## MUST
- Production configuration MUST be versioned, reviewable, or otherwise auditable.
- Configuration changes MUST define expected effect, validation, and rollback where practical.
- Environment-specific configuration MUST be clearly separated from application defaults.
- Sensitive configuration MUST use approved secret-management mechanisms.
- Feature flags controlling critical behavior MUST have owners and removal criteria.

## MUST NOT
- MUST NOT store plaintext credentials in source-controlled configuration.
- MUST NOT make undocumented production-only changes that cannot be reconstructed.
- MUST NOT use feature flags as permanent unmanaged architecture.

## SHOULD
- Prefer automated validation and schema checks for configuration.
- Use gradual activation for high-impact configuration changes when supported.

## Exceptions
Manual emergency changes require recorded values, reason, approver, and reconciliation back into the authoritative configuration source.

## Verification
Inspect configuration history, secret references, validation checks, flag inventories, and differences between deployed and authoritative state.