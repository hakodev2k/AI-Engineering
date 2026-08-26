# Cross-Platform Client Compatibility

## Purpose
Maintain predictable RTC behavior across browsers, mobile OS versions, native SDKs, devices, and mixed-version sessions.

## When to use
Use for compatibility matrices, rollout planning, browser regressions, device-specific failures, or SDK upgrades.

## Inputs
Supported platform policy, capability data, client versions, device cohorts, automated test matrix, and production telemetry.

## Core knowledge
WebRTC APIs and media capabilities vary by engine, OS, hardware, permissions, background lifecycle, codec acceleration, and release version. Capability detection is safer than user-agent assumptions when APIs permit it.

## Procedure
1. Define supported platform/version tiers.
2. Inventory capture, codec, transceiver, network, and lifecycle capabilities.
3. Build representative mixed-client scenarios.
4. Test permission, device switching, background/foreground, network handoff, renegotiation, and recovery.
5. Compare browser/native implementation differences.
6. Isolate platform workarounds behind explicit compatibility boundaries.
7. Gate upgrades with cohort telemetry and rollback capability.
8. Retire workarounds only after support-window evidence permits it.

## Decision points
Use progressive enhancement where capability differs. Drop old versions when reliability/security cost exceeds product support value, but make that a product decision with usage evidence.

## Common failure patterns
User-agent-only branching; testing clients only against identical versions; hidden platform workarounds scattered through media logic; ignoring background lifecycle; upgrading SDKs without RTC regression coverage.

## Verification
Run the supported matrix and verify setup, media, device operations, renegotiation, reconnect, and quality thresholds for mixed versions.

## Expected output
A maintained compatibility policy, isolated workarounds, and regression evidence.

## Stop conditions
Stop when required support policy is undefined or a platform defect requires vendor escalation without a safe workaround.