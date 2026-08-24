# Secrets Management Rules

## Purpose
Prevent credential exposure and reduce the blast radius of compromised backend secrets.

## Scope
API keys, passwords, tokens, certificates, signing keys, connection credentials, and secret-bearing configuration.

## MUST
- Secrets MUST be stored in an approved secret-management mechanism rather than source code or ordinary configuration files.
- Access to secrets MUST follow least privilege and be scoped to the runtime identity that needs them.
- Rotation procedures MUST exist for production credentials and be tested where operationally significant.
- Secret access and changes MUST be auditable.

## MUST NOT
- MUST NOT commit secrets to source control, logs, test fixtures, container images, or generated artifacts.
- MUST NOT reuse high-value production secrets across environments.
- MUST NOT expose secrets through client-visible error responses or diagnostics.

## SHOULD
- Prefer short-lived credentials and workload identity over long-lived static secrets.
- Secret rotation SHOULD avoid service interruption.

## Exceptions
Temporary static credentials require owner, expiry, scope, compensating controls, and approved migration plan.

## Verification
Use secret scanners, repository history inspection, runtime configuration review, permission checks, rotation tests, and audit logs.