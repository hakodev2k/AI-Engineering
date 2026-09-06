# Provider Security Rules

## Purpose
Protect credentials, transport, provider integrations, and trust boundaries used by AI routing.

## Scope
Authentication, authorization, secrets, endpoints, certificates, network controls, and provider account separation.

## MUST
- Provider credentials MUST be stored in approved secret-management systems and scoped to least privilege.
- Production routing MUST use authenticated encrypted transport to provider endpoints.
- Provider accounts or projects SHOULD be separated where environment or tenant risk requires isolation.
- Credential use and high-risk configuration changes MUST be auditable.
- Provider SDK and endpoint changes MUST be reviewed for new permissions and data flows.

## MUST NOT
- MUST NOT hard-code provider API keys or tokens in source, route files, logs, or test fixtures.
- MUST NOT disable TLS verification to resolve connectivity failures.
- MUST NOT share privileged credentials across unrelated environments without explicit risk acceptance.

## SHOULD
- Prefer short-lived or workload-bound credentials when providers support them.
- Rotate credentials according to security policy and incident needs.

## Exceptions
Exceptions require security approval, compensating controls, expiry, and documented remediation.

## Verification
Inspect secret references, IAM configuration, TLS settings, audit logs, dependency scans, and credential-leak checks.