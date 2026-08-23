# Persistent Storage and Flash

## Purpose
Store configuration, counters, logs, and state safely across reset while respecting flash endurance, erase geometry, atomicity, and corruption risks.

## When to use
Use for NVM design, configuration persistence, calibration, event logs, wear issues, or corrupted settings.

## Inputs
Flash/EEPROM characteristics, data model, update frequency, retention/endurance requirements, power-loss model, and boot behavior.

## Context to inspect
Inspect erase/write granularity, endurance, ECC, partition layout, serialization, versioning, checksums, write frequency, and recovery defaults.

## Core knowledge
Flash writes are not equivalent to RAM assignments. Erase-before-write, limited endurance, torn writes, bit transitions, and power loss require transactional patterns. Persistent schemas evolve across firmware versions.

## Procedure
1. Classify persistent data by criticality and update rate.
2. Define layout and ownership separate from executable images.
3. Add versioned records and integrity checks.
4. Design atomic commit using copy-on-write, journaling, slots, or equivalent.
5. Bound write frequency and estimate endurance.
6. Define migration and unknown-version behavior.
7. Define defaults/recovery for corrupt records.
8. Test power interruption at each write phase.
9. Monitor wear/corruption indicators where feasible.

## Decision points
Use simple redundant slots for small infrequent records; log-structured/wear-leveled schemes for frequent updates. External storage is justified when capacity/endurance requirements exceed internal flash.

## Common failure patterns
Writing counters on every event, no schema version, in-place multiword updates, sharing sectors with code unexpectedly, trusting checksum alone as authenticity, and erasing during timing-critical work.

## Verification
Run endurance estimates, corruption tests, cross-version migrations, power-cut tests, and full/empty boundary scenarios.

## Expected output
A versioned persistent-storage design with atomicity, endurance budget, migration, and recovery behavior.

## Stop conditions
Stop when actual flash geometry/endurance or bootloader partition ownership is unknown.