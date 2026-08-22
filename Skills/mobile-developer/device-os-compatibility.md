# Device and OS Compatibility

## Purpose
Ship predictable behavior across supported devices, screen classes, hardware, and OS versions.

## When to use
Platform upgrades, device-specific defects, compatibility planning, release qualification.

## Inputs
Support matrix, analytics, platform API usage, device capabilities.

## Context to inspect
Minimum/target OS, feature checks, deprecated APIs, layouts, permissions, OEM/device quirks.

## Core knowledge
Version checks alone are insufficient when capabilities vary. Prefer capability detection and graceful degradation.

## Procedure
1. Define supported OS/device matrix from product and usage evidence.
2. Inventory APIs with version/capability constraints.
3. Add guarded fallbacks.
4. Test screen sizes, orientations, input modes, memory classes, and hardware-dependent features.
5. Validate permission behavior across OS changes.
6. Run upgrade tests from supported prior app versions.
7. Monitor crash/ANR/error rates by OS/device after release.

## Decision points
Drop legacy support when maintenance/security cost exceeds user/business value with explicit approval.

## Common failure patterns
Testing only flagship devices, hard-coded dimensions, assuming hardware presence, silent API behavior changes.

## Verification
Matrix testing and production segmentation show acceptable behavior.

## Expected output
Documented compatibility policy, fallbacks, and evidence.

## Stop conditions
Escalate platform defects without viable workaround or conflicting support commitments.