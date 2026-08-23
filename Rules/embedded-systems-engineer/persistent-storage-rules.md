# Persistent Storage Rules

## Purpose
Preserve data integrity across resets, power loss, wear, and schema evolution.

## Scope
Flash, EEPROM, filesystems, NVM records, configuration, calibration, and counters.

## MUST
- Define integrity checks and recovery for partially written or corrupted persistent data.
- Respect erase/write endurance and alignment constraints.
- Version persistent schemas and define migration/default behavior.

## MUST NOT
- Assume a multi-step write is atomic unless the storage technology guarantees it.
- Persist sensitive material without required confidentiality and integrity protection.

## SHOULD
- Use journaling, copy-on-write, wear leveling, or redundant records according to failure risk.

## Exceptions
Non-critical disposable data may use simpler persistence when loss is explicitly acceptable.

## Verification
Test power interruption at write boundaries, corruption, full storage, wear scenarios, migration, and factory reset.