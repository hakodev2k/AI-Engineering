# Save Load and Versioning

## Purpose
Design durable save data that can survive application updates, partial failures, schema evolution, and platform storage constraints.

## When to use
Use for checkpoints, profiles, progression, settings, cloud saves, migrations, or corrupted-save incidents.

## Inputs
Persistent state, save frequency, platform storage APIs, compatibility policy, cloud synchronization needs, security requirements, and existing schemas.

## Context to inspect
Inspect serialization, identifiers, atomic-write behavior, backups, migration code, autosave triggers, cloud conflict rules, and failure handling.

## Core knowledge
Persistence formats become long-lived contracts. Stable identifiers and explicit schema versions matter more than object-memory shape. Writes should be atomic or recoverable. Migration must be tested with real historical fixtures.

## Procedure
1. Define what state must persist and what can be reconstructed.
2. Create a versioned save schema independent of transient runtime objects.
3. Use stable identifiers for referenced content.
4. Define atomic write and backup strategy.
5. Implement migrations between supported versions.
6. Validate input before applying it to runtime state.
7. Handle missing/unknown content gracefully.
8. Define cloud conflict resolution where applicable.
9. Test interrupted writes and historical saves.
10. Instrument migration and corruption failures without logging sensitive data.

## Decision points
Prefer explicit DTO/schema formats over serializing arbitrary engine objects. Choose forward/backward compatibility according to release and rollback policy. Encrypt only when threat model requires confidentiality; integrity and anti-tamper are separate concerns.

## Common failure patterns
Serializing runtime references, renaming fields without migration, non-atomic overwrites, no corruption recovery, content IDs tied to scene order, and untested cloud conflicts.

## Verification
Load fixtures from every supported version, simulate interrupted writes, validate backups, test missing content, and verify cloud conflict behavior.

## Expected output
Versioned, recoverable persistence with tested migration paths.

## Stop conditions
Stop before destructive migration when historical formats are unavailable, compatibility requirements are unclear, or platform storage behavior cannot be validated.