# Secrets Management Architecture Rules

## Purpose
Prevent credential exposure and ensure secrets have controlled ownership, distribution, rotation, and revocation.

## Scope
API keys, passwords, certificates, signing keys, database credentials, tokens, and other machine or human secrets.

## MUST
- Secrets MUST be stored in approved secret-management systems or equivalently protected mechanisms.
- Secret access MUST be least-privilege, auditable, and separated by environment and workload where practical.
- Rotation and revocation procedures MUST exist for high-impact secrets and be testable.
- Applications MUST retrieve secrets without embedding them in source, images, templates, or logs.
- Secret compromise scenarios MUST have documented containment and recovery actions.

## MUST NOT
- MUST NOT commit plaintext secrets to source control.
- MUST NOT share long-lived credentials across unrelated workloads.
- MUST NOT copy production secrets into lower-trust environments.

## SHOULD
- Prefer dynamic or short-lived credentials and workload identity over static secrets.

## Exceptions
Require documented limitation, bounded lifetime, compensating controls, monitoring, and approval.

## Verification
Inspect repositories, images, CI configuration, secret stores, access policy, audit logs, rotation records, and secret-scanning results.