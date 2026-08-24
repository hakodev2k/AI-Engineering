# Secrets and Credentials Rules

## Purpose
Prevent disclosure, uncontrolled persistence, and unsafe lifecycle management of database secrets.

## Scope
Covers passwords, tokens, keys, certificates, connection secrets, recovery material, and bootstrap credentials.

## MUST
- Secrets MUST be stored in an approved secrets-management system and encrypted in transit and at rest.
- Each secret MUST have an owner, intended consumers, scope, and rotation/revocation procedure.
- Rotation MUST be designed to avoid unnecessary downtime and MUST be verified after completion.
- Secret exposure MUST trigger containment, revocation or rotation, impact assessment, and incident handling.

## MUST NOT
- Secrets MUST NOT appear in source control, tickets, chat transcripts, logs, telemetry, screenshots, or documentation.
- Long-lived credentials MUST NOT be copied between environments.
- Secret rotation MUST NOT be executed against production without authority and rollback planning when service impact is possible.

## SHOULD
- Prefer dynamic or short-lived credentials and workload identity.
- Applications SHOULD support overlapping credential validity to enable safe rotation.

## Exceptions
Exceptions require documented necessity, bounded duration, exposure analysis, compensating controls, and security approval.

## Verification
Use secret scanning, configuration inspection, vault audit logs, rotation tests, repository history checks, and runtime validation. Confirm revoked credentials can no longer authenticate.