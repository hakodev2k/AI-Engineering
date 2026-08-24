# Android Platform Compatibility Rules

## Purpose
Keep behavior correct across supported API levels, device capabilities, form factors, and platform policy changes.

## Scope
Applies to Android SDK APIs, permissions, behavior changes, OEM/device variation, and capability detection.

## MUST
- Define and honor supported minimum/target SDK and device capability requirements.
- Guard version-specific APIs and behavior with correct runtime checks or compatibility abstractions.
- Test platform behavior changes that affect permissions, background execution, storage, notifications, or security.
- Handle absent optional hardware/services as normal runtime conditions.
- Review target-SDK upgrades for behavior changes before release.

## MUST NOT
- Infer capability solely from device model names when a runtime capability check exists.
- Suppress compatibility warnings without validating the guarded behavior.
- Assume emulator success proves behavior on all supported physical-device classes.

## SHOULD
- Maintain a representative device/API test matrix driven by usage and risk.
- Prefer platform compatibility libraries when they provide well-supported semantics.

## Exceptions
Unsupported edge-device classes must be explicitly excluded in product/support requirements.

## Verification
Use lint, API-level tests, physical-device/emulator matrix results, permission/background behavior tests, and target-SDK migration checklists.