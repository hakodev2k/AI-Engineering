# Evidence Storage Rules

## Purpose
Protect evidence against loss, unauthorized access, corruption, and uncontrolled duplication.

## Scope
Covers evidence repositories, removable media, backups, working copies, archives, and transfers.

## MUST
- Evidence storage MUST enforce access control, integrity protection, and auditable access appropriate to sensitivity.
- Critical evidence MUST have a documented durability and backup strategy.
- Stored evidence MUST retain identifiers, provenance, hashes, and retention status.
- Transfers MUST use approved protected channels and integrity verification.
- Disposal MUST be authorized, recorded, and blocked by active legal or retention holds.

## MUST NOT
- MUST NOT store evidence in unmanaged personal locations.
- MUST NOT rely on a single unverified copy for irreplaceable evidence.
- MUST NOT weaken encryption or access controls merely for analyst convenience.

## SHOULD
- Use immutable or append-only controls for authoritative evidence sets.
- Periodically verify archived evidence integrity.

## Exceptions
Temporary local staging may be permitted when operationally necessary if encrypted, access-limited, time-bounded, verified, and securely removed afterward.

## Verification
Inspect repository permissions, audit logs, backup status, hash checks, transfer records, retention flags, and disposal evidence.