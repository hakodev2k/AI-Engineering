# Bootloader and Firmware Update

## Purpose
Design recoverable firmware installation and boot selection that survives interrupted updates, invalid images, and field failures.

## When to use
Use for OTA/local update features, bootloader changes, dual-bank images, rollback, or bricked-device prevention.

## Inputs
Flash layout, boot ROM behavior, image format, update transport, power-failure model, security requirements, and production provisioning process.

## Context to inspect
Inspect reset flow, image metadata, partition layout, vector relocation, erase/write granularity, integrity checks, version policy, rollback state, and recovery interfaces.

## Core knowledge
An updater modifies the code required to recover the device, so atomicity and recoverability dominate convenience. Image authenticity, integrity, compatibility, anti-rollback policy, and power-loss-safe state transitions must be explicit.

## Procedure
1. Define trusted boot/update boundaries and failure assumptions.
2. Design non-overlapping boot/application/storage layout.
3. Define image header, version, compatibility, integrity, and signature fields.
4. Choose single-image recovery, A/B, or staged-copy strategy.
5. Define update state transitions that survive reset at every step.
6. Validate image before activation.
7. Define health confirmation and rollback.
8. Test interruption during each erase/write/state transition.
9. Preserve a documented recovery path.

## Decision points
Prefer A/B when flash allows and field recoverability is critical. Use rollback protection only with a safe operational process for emergency recovery and key/version management.

## Common failure patterns
Updating boot-critical code without recovery, non-atomic metadata, accepting corrupt/incompatible images, no power-loss testing, version comparison bugs, and activation before validation.

## Verification
Run update, downgrade, corrupt-image, wrong-target, repeated-reset, and power-cut tests across update phases on real hardware.

## Expected output
A recoverable update architecture with explicit image validation, activation, rollback, and failure-state behavior.

## Stop conditions
Stop when flash layout, trust model, signing/provisioning process, or recovery requirements are unresolved.