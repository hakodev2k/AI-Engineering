# Secrets and Key Management

## Purpose
Prevent credential disclosure and unsafe cryptographic-key handling.

## Scope
Secrets, API credentials, certificates, encryption keys, signing keys, and secret stores.

## MUST
- Secrets and private keys MUST be stored in approved secret or key-management systems.
- Access MUST be least-privilege and auditable.
- Rotation, expiry, revocation, and compromise procedures MUST exist for security-critical credentials.
- Secret rotation affecting production MUST be prepared with dependency and rollback analysis and approved before execution.

## MUST NOT
- MUST NOT commit secrets or private keys to source control, images, templates, logs, or tickets.
- MUST NOT expose secret values through command output or telemetry.
- MUST NOT reuse long-lived credentials across unrelated workloads.

## SHOULD
- Prefer workload identity over stored credentials.
- Automate rotation when consumers can safely tolerate it.

## Exceptions
Require reason, duration, exposure analysis, compensating controls, owner, and approval.

## Verification
Run secret scanning; inspect secret-store ACLs, key policies, rotation state, audit logs, certificate expiry, and deployment configuration.