# Clipboard, Screenshot, and UI Exposure Rules

## Purpose
Reduce accidental disclosure of sensitive information through operating-system and user-interface surfaces.

## Scope
Clipboard, screenshots, screen recording, task switchers, notifications, keyboards, autofill, accessibility surfaces, and overlays.

## MUST
- Identify screens and fields containing high-sensitivity data and apply platform protections appropriate to the threat model.
- Minimize sensitive content shown in notifications, task previews, and lock-screen surfaces.
- Clear or expire application-managed clipboard secrets when platform capabilities and user expectations permit.
- Ensure masking does not replace secure storage or authorization controls.

## MUST NOT
- Copy reusable secrets to the clipboard automatically without a justified user workflow.
- Display full sensitive identifiers where partial disclosure is sufficient.
- Assume visual masking removes sensitive values from underlying application state or telemetry.

## SHOULD
- Use platform autofill/password-manager integration instead of custom secret-copy workflows.
- Provide explicit reveal actions for sensitive values when usability requires display.

## Exceptions
Exposure exceptions require user need, data classification, alternatives considered, and risk review.

## Verification
Inspect notifications, recent-app previews, screenshots, screen recording, clipboard behavior, autofill, accessibility output, and background transitions.