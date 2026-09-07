# Encryption and Key Management Rules

## Purpose
Protect stored data without creating unrecoverable key dependencies.

## Scope
Applies to encryption at rest, transport encryption, key hierarchy, rotation, escrow, and recovery.

## MUST
- Define encryption requirements by data classification and threat model.
- Separate key-management authority from ordinary storage administration where practical.
- Test key rotation and recovery procedures before production reliance.

## MUST NOT
- Store encryption keys beside protected data without an approved security design.
- Rotate or revoke production keys without human approval and a validated recovery path.
- Treat encryption as a substitute for access control or integrity validation.

## SHOULD
- Prefer managed, auditable key services and short cryptoperiods appropriate to risk.
- Monitor failed decrypt operations and key-access anomalies.

## Exceptions
Legacy constraints require documented exposure, compensating controls, owner, and remediation plan.

## Verification
Inspect encryption configuration, key policies, rotation logs, recovery drills, and access audit records.