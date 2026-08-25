# Backup and Recovery Rules

## Purpose
Recover secrets-management capability after loss or corruption while preserving confidentiality and revocation semantics.

## Scope
Secret metadata, encrypted values, key material, policies, audit configuration, and recovery credentials.

## MUST
- Recovery objectives MUST be defined for critical secret-management services.
- Backups MUST be encrypted, access-controlled, inventoried, and tested for restoration.
- Recovery procedures MUST address dependencies such as root keys, identity providers, HSMs, DNS, and network controls.
- Restored state MUST be reconciled against rotations and revocations that occurred after the backup point.

## MUST NOT
- Recovery copies MUST NOT become an unmanaged alternate secret store.
- Recovery keys MUST NOT be protected solely by the system they are intended to recover.
- A restore test MUST NOT expose production secret values to unauthorized test personnel.

## SHOULD
- Use isolated recovery environments and dual control for highly privileged recovery material.
- Periodically exercise full dependency-aware recovery.

## Exceptions
Systems without backup support require documented rebuild procedures, authoritative source identification, recovery timing evidence, and risk acceptance.

## Verification
Inspect backup configuration, encryption and access policies, restore-test evidence, recovery runbooks, dependency tests, and post-restore reconciliation records.