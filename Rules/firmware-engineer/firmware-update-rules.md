# Firmware Update

## Purpose
Prevent bricking, unauthorized firmware, and unsafe partial updates.

## Scope
Bootloaders, OTA/local updates, image validation, rollback, and version transitions.

## MUST
- Update images MUST be authenticated before execution when the threat model requires trusted firmware.
- Image integrity MUST be verified before activation.
- Update design MUST tolerate power loss at every interruption point or provide a documented recovery mechanism.
- Compatibility between bootloader, firmware, persistent schema, and hardware revision MUST be checked.
- Rollback or recovery strategy MUST exist for production updates unless explicitly risk-accepted.
- Production rollout MUST require human approval and staged verification.

## MUST NOT
- Failed or partially written images MUST NOT become the only bootable image.
- Version checks MUST NOT be bypassed silently.

## SHOULD
- Rollouts SHOULD be staged with health criteria and halt conditions.

## Exceptions
Irreversible update strategies require explicit approval, evidence, and recovery planning.

## Verification
Run interruption tests, signature/integrity failures, downgrade tests, compatibility tests, and recovery drills.