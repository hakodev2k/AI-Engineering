# Secrets and Build Credentials Rules

## Purpose
Prevent compromise of software supply chains through leaked, overprivileged, or persistent credentials used by build and release systems.

## Scope
Applies to CI/CD secrets, registry credentials, signing identities, deployment tokens, cloud credentials, package-manager tokens, and automation service accounts.

## MUST
- Build and release credentials MUST use least privilege and be scoped to the minimum required repository, environment, and operation.
- Secrets MUST be stored in approved secret-management systems and injected only into jobs that require them.
- Long-lived credentials MUST have defined rotation and revocation procedures.
- Secret exposure incidents MUST trigger assessment of artifacts, releases, and actions performed during the exposure window.
- Logs and diagnostic output MUST redact secret values and authentication tokens.

## MUST NOT
- Secrets MUST NOT be committed to source control, baked into images, or embedded in distributable artifacts.
- Untrusted code MUST NOT receive privileged release or signing credentials.
- Shared personal credentials MUST NOT be used for automated production publishing.

## SHOULD
- Prefer short-lived federated workload identity over static credentials where supported.
- Secret scopes SHOULD differ between development, staging, and production.

## Exceptions
Exceptions require risk justification, compensating controls, restricted scope, expiration, and security approval.

## Verification
Use secret scanning, CI configuration review, credential-permission inspection, artifact inspection, audit logs, rotation records, and tests proving untrusted jobs cannot access protected credentials.