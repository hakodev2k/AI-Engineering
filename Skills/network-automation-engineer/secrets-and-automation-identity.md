# Secrets and Automation Identity

## Purpose
Secure machine identities, credentials, certificates, and authorization used by network automation.

## When to use
Use when building or reviewing any workflow that authenticates to devices, controllers, APIs, or source-of-truth systems.

## Inputs
Identity provider, secret manager, device/API auth methods, RBAC model, environments, and audit requirements.

## Context to inspect
Service accounts, token lifetimes, SSH keys, certificates, local credential files, CI secrets, and privilege boundaries.

## Core knowledge
Automation should use dedicated identities with least privilege, short-lived credentials where possible, rotation, and auditable attribution. Shared admin credentials destroy accountability.

## Procedure
1. Enumerate systems and required actions.
2. Create dedicated machine identities per trust boundary.
3. Grant least required roles/commands.
4. Store secrets in approved secret management.
5. Prefer short-lived tokens/certificates over static passwords.
6. Rotate credentials and test revocation.
7. Prevent secrets in code, logs, diffs, and artifacts.
8. Separate production from non-production identities.
9. Monitor authentication and privilege use.
10. Define break-glass access independently.

## Decision points
Use centralized AAA/RBAC when devices support it; use local accounts only for controlled fallback. Prefer certificate/token federation where lifecycle is stronger.

## Common failure patterns
One shared superuser, non-expiring keys, secrets in inventory, logging Authorization headers, and production credentials in labs.

## Verification
Secret scanning, negative permission tests, rotation/revocation exercise, and audit-log attribution checks.

## Expected output
Identity matrix, least-privilege roles, secret lifecycle, and verification evidence.

## Stop conditions
Stop deployment when credentials require excessive privilege, cannot be rotated, or would be exposed in automation artifacts.