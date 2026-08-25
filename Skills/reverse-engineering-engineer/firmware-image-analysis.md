# Firmware Image Analysis

## Purpose
Safely decompose firmware images into containers, filesystems, executables, configuration, and hardware-specific components for authorized engineering analysis.

## When to use
Use for device interoperability, update analysis, vulnerability research, failure investigation, or legacy maintenance.

## Inputs
Firmware image/update package, device model/version, architecture clues, boot documentation if available, hashes.

## Preconditions
Preserve the original image and avoid flashing or modifying hardware until image structure and recovery procedures are understood.

## Context to inspect
Headers, partitions, compression, filesystems, bootloaders, kernels, root filesystems, device trees, signatures, checksums, update scripts, configuration, and embedded executables.

## Core knowledge
Firmware may contain nested containers, sparse images, proprietary headers, mixed architectures, checksums, and cryptographic signatures. Extracting is safer than modifying; authenticity controls must not be bypassed outside authorization.

## Procedure
1. Hash and identify the image/update format.
2. Locate partition tables, offsets, compression, and nested containers.
3. Extract components without altering the original.
4. Identify architectures and executable formats per component.
5. Inspect boot/update scripts and dependency relationships.
6. Recover filesystems and configuration read-only.
7. Map high-value services, drivers, parsers, and interfaces.
8. Correlate static findings with documented hardware behavior.
9. Record extraction commands, offsets, hashes, and uncertainties.

## Decision points
Prefer offline extraction. Use emulation or hardware observation only when static analysis cannot answer the question and the environment is controlled.

## Common failure patterns
Assuming one architecture; ignoring nested compression; modifying signed regions; confusing filesystem slack with active content; flashing unverified images.

## Verification
Recompute component hashes, validate offsets/sizes, and confirm extracted filesystem or executable metadata is internally consistent.

## Expected output
A reproducible firmware component map and prioritized analysis targets.

## Stop conditions
Stop before destructive flashing, signature bypass, or hardware actions without explicit authorization and recovery capability.