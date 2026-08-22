# Secrets Management Rules

## Purpose
Prevent credential exposure and unsafe secret lifecycle practices.

## Scope
Applies to application secrets, platform credentials, certificates, signing keys, tokens, and secret delivery mechanisms.

## MUST
- Secrets MUST be stored in approved secret-management systems.
- Secret access MUST be limited to required identities and environments.
- Rotation procedures MUST be defined for high-impact secrets.
- Secret injection MUST avoid persistence in source control, build logs, images, and diagnostic output.

## MUST NOT
- MUST NOT commit secrets to repositories or templates.
- MUST NOT expose secrets through environment inspection endpoints or user-facing errors.
- MUST NOT rotate production secrets without assessing dependent workloads and rollback.

## SHOULD
- Prefer workload identity over secrets when feasible.
- Prefer automated rotation with compatibility overlap.

## Exceptions
Temporary secrets require expiration, owner, risk justification, and removal verification.

## Verification
Use secret scanning, access-policy review, runtime configuration inspection, rotation tests, and audit logs.