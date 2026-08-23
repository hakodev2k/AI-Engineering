# Firmware Update Rules

## Purpose
Make firmware updates authentic, recoverable, compatible, and safe under interruption.

## Scope
Bootloaders, OTA/local update, image validation, rollback, compatibility, and update state.

## MUST
- Authenticate update images and validate integrity before execution.
- Define compatibility checks and a recoverable strategy for interrupted updates.
- Preserve a verified rollback or recovery path when the product risk requires it.

## MUST NOT
- Execute unsigned or untrusted firmware where secure update is a requirement.
- Make an irreversible field update without explicit risk review and approval.

## SHOULD
- Use atomic activation or A/B strategies when storage and risk justify them.

## Exceptions
Factory-only mechanisms may differ when physically controlled and documented.

## Verification
Test valid, invalid, downgraded, incompatible, corrupted, power-interrupted, and rollback update scenarios.