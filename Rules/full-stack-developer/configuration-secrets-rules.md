# Configuration and Secrets Rules

## Purpose
Keep environment configuration controlled and credentials protected.
## Scope
Client configuration, server settings, feature flags, credentials, and environment differences.
## MUST
- Store secrets in approved secret-management mechanisms and grant least privilege.
- Validate required configuration at startup or before dependent functionality executes.
- Separate public client configuration from confidential server configuration.
## MUST NOT
- Commit secrets or embed confidential credentials in frontend bundles.
- Use production credentials in development or tests without explicit controlled need.
## SHOULD
- Keep environment differences minimal and auditable.
## Exceptions
Emergency secret changes require authorized execution and post-change audit.
## Verification
Secret scans, bundle inspection, configuration validation tests, and access reviews.