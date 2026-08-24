# Database Authentication Rules

## Purpose
Establish strong, attributable authentication for every database principal.

## Scope
Covers interactive users, applications, automation, replication, administration, and break-glass access.

## MUST
- Every principal MUST authenticate using an approved mechanism appropriate to its threat model.
- Human administrative access MUST use phishing-resistant MFA when supported by the identity path.
- Workloads MUST use distinct identities per security boundary and environment.
- Authentication failures and privileged logins MUST produce auditable events.
- Break-glass credentials MUST be protected, monitored, tested, and reviewed after use.

## MUST NOT
- Default, anonymous, or vendor sample accounts MUST NOT remain enabled in production.
- Credentials MUST NOT be embedded in source, images, scripts, or connection strings committed to version control.
- Production authentication controls MUST NOT be weakened to resolve convenience or connectivity issues without explicit approval.

## SHOULD
- Prefer federated, certificate-based, managed, or other short-lived authentication over static passwords.
- Authentication policy SHOULD define lockout or throttling without creating trivial denial-of-service paths.

## Exceptions
Any legacy authentication exception requires documented dependency, expiry target, compensating controls, monitoring, and risk acceptance.

## Verification
Review enabled principals, authentication configuration, identity mappings, secret scans, login telemetry, MFA policy, and break-glass test records. Attempt negative authentication tests in a safe environment.