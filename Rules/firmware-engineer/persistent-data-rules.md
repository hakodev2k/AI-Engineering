# Persistent Data

## Purpose
Protect configuration, calibration, counters, and state across resets and upgrades.

## Scope
Flash, EEPROM, NVM, filesystems, retained memory, and persistent schemas.

## MUST
- Persistent records MUST have integrity validation appropriate to failure consequences.
- Schema/version compatibility MUST be explicit across firmware updates.
- Writes MUST account for power loss, erase granularity, endurance, and atomicity limitations.
- Critical configuration MUST have defined defaults and corruption recovery behavior.
- Wear-sensitive data MUST have an endurance strategy based on expected write frequency.

## MUST NOT
- Firmware MUST NOT assume a write completed merely because the API returned before durable media completion when durability matters.
- Destructive schema changes MUST NOT ship without migration/recovery strategy and approval.

## SHOULD
- Redundant or journaled storage SHOULD be used for critical state where justified.

## Exceptions
Exceptions require lifetime calculations and recovery evidence.

## Verification
Test torn writes, corruption, erased devices, downgrade/upgrade cycles, endurance assumptions, and factory reset.