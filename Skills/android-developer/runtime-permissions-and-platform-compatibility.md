# Runtime Permissions and Platform Compatibility

## Purpose
Implement Android features that request only necessary permissions and behave correctly across API levels, scoped-storage changes, background restrictions, and OEM variation.

## When to use
Use when adding camera, location, media, notifications, Bluetooth, storage, sensors, or other platform-gated capabilities.

## Inputs
Feature requirements, minimum/target SDK, device matrix, permission needs, fallback behavior, Play policy constraints.

## Preconditions
Identify whether each capability actually requires a dangerous permission on every supported API level.

## Context to inspect
Manifest permissions, runtime request flows, Activity Result APIs, feature checks, SDK guards, storage/media APIs, background behavior, and OEM-specific reports.

## Core knowledge
Permission semantics and platform restrictions change by Android version. Requests should be contextual, minimal, recoverable after denial, and resilient to permanent denial or unavailable hardware.

## Procedure
1. Map the feature to platform capabilities and API-level differences.
2. Remove permissions that are unnecessary for supported implementations.
3. Request permission at the point of clear user intent.
4. Handle grant, denial, repeated denial, and settings-managed states.
5. Provide degraded behavior when capability is optional.
6. Guard version-specific APIs and validate feature availability.
7. Test target-SDK behavior changes before upgrading production.
8. Validate background, storage, notification, and media rules for supported versions.
9. Test on representative API levels and at least one constrained/OEM device class when risk warrants it.
10. Document compatibility exceptions and telemetry.

## Decision points
Prefer system pickers and scoped APIs that avoid broad permissions. Ask for background access only when core user value clearly depends on it.

## Common failure patterns
Requesting permissions on launch, assuming denial is temporary, outdated storage assumptions, missing SDK guards, broad permission bundles, and no fallback for unsupported hardware.

## Verification
Exercise every permission state and supported API boundary on device/emulator and verify the feature fails gracefully without crashes or inaccessible loops.

## Expected output
Minimal permission set, version-aware implementation, fallback behavior, and compatibility test evidence.

## Stop conditions
Escalate when product requirements conflict with platform or store policy, or required capability is unsupported on target devices.