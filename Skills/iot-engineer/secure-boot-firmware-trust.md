# Secure Boot and Firmware Trust

## Purpose
Ensure devices execute authorized firmware and preserve a verifiable chain of trust.

## When to use
Use for bootloader design, signing infrastructure, firmware updates, and security reviews.

## Inputs
Boot chain, MCU/SoC capabilities, signing keys, update format, recovery requirements.

## Context to inspect
ROM trust anchors, bootloader, debug interfaces, key storage, image verification, rollback controls.

## Core knowledge
Secure boot depends on protected roots of trust, signature verification before execution, controlled key rotation, anti-rollback where needed, and recoverability without bypassing trust.

## Procedure
1. Map every executable boot stage.
2. Identify immutable or hardware-protected trust anchors.
3. Define image signing and verification.
4. Separate signing authority from build infrastructure.
5. Define key rotation and compromise recovery.
6. Add rollback protection when older firmware is unsafe.
7. Secure debug and recovery modes.
8. Test corrupted, unsigned, old, and partially written images.

## Decision points
Anti-rollback improves security but can obstruct emergency recovery; design explicit recovery versions or authorized exceptions rather than disabling verification.

## Common failure patterns
Signing keys in CI, unsigned recovery images, debug bypasses, version checks without cryptographic trust, and unrecoverable failed updates.

## Verification
Attempt unauthorized boots, downgrade attacks, corrupted images, key rotation, and recovery on representative hardware.

## Expected output
A tested chain-of-trust design and signing lifecycle.

## Stop conditions
Escalate if root keys are exposed or hardware cannot meet required trust guarantees.