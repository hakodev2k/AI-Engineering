# Firmware Update and Rollback

## Purpose
Design reliable field updates that preserve recoverability and compatibility.

## When to use
Use for bootloader/application update flows, OTA delivery, release design or failed-update investigation.

## Inputs
Image format, storage layout, version policy, integrity/authenticity requirements, transport and rollback constraints.

## Context to inspect
Boot selection, image metadata, persistent state, interruption behavior, compatibility rules and recovery path.

## Core knowledge
An update is a distributed state transition. Power loss, partial transfer, incompatible state and invalid images must have defined outcomes.

## Procedure
1. Define image and version contract.
2. Define validation before activation.
3. Preserve a recoverable boot path.
4. Make state transitions interruption-safe.
5. Define rollback eligibility.
6. Handle persistent-data compatibility.
7. Instrument update status and failure reason.
8. Test interrupted updates at multiple phases.
9. Validate downgrade policy.

## Decision points
Use dual-image strategies when storage permits and recovery value is high; use staged or external recovery when constraints demand it.

## Common failure patterns
Activating before validation, non-atomic metadata, incompatible persistent data, endless rollback loops and no recovery after interrupted writes.

## Verification
Exercise successful, corrupted, interrupted and incompatible update scenarios on representative devices.

## Expected output
A recoverable update state machine with explicit compatibility policy.

## Stop conditions
Escalate before changing boot or update trust contracts without product security ownership.