# Mobile Automation Testing

## Purpose
Design reliable automation for mobile applications across device, OS, lifecycle, network, and permission variability.

## When to use
Use for native/hybrid apps where device behavior materially affects quality.

## Inputs
Supported devices/OS versions, critical journeys, app builds, backend dependencies, permission model.

## Context to inspect
Lifecycle, deep links, notifications, permissions, orientation, offline behavior, keyboards, background/foreground transitions, installation/upgrades, and device matrix.

## Core knowledge
Mobile risk is broader than screen interaction. Validate lifecycle and platform behavior while keeping most business-rule coverage below the UI layer.

## Procedure
1. Build a risk-based device/OS matrix from actual support and usage.
2. Automate only critical platform/UI journeys.
3. Isolate app state and test accounts.
4. Use stable accessibility/resource identifiers.
5. Test permissions and denied states.
6. Exercise background/foreground, interruption, and relaunch behavior.
7. Validate representative network loss/latency scenarios.
8. Cover deep links and notifications where critical.
9. Test clean install and upgrade paths for release risk.
10. Capture device logs, screenshots, and video on failure.

## Decision points
Use emulators for broad fast CI; retain real-device coverage for hardware/platform-sensitive risks. Do not multiply every test across every device.

## Common failure patterns
Coordinate-based selectors, shared device state, ignoring lifecycle, emulator-only confidence, uncontrolled notifications/permissions.

## Verification
Run critical flows on representative real devices and CI emulators; repeat lifecycle/network cases and inspect artifacts.

## Expected output
A bounded mobile automation matrix with stable critical-flow coverage.

## Stop conditions
Escalate when required device capabilities or signing/provisioning access are unavailable.