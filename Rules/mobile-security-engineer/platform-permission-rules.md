# Platform Permission Rules

## Purpose
Reduce security and privacy exposure from mobile operating-system permissions and capabilities.

## Scope
Runtime permissions, entitlements, capabilities, sensors, location, camera, microphone, contacts, files, Bluetooth, and background access.

## MUST
- Request only permissions required for an implemented user-facing purpose.
- Request sensitive permissions at a contextually relevant point and handle denial safely.
- Reassess permissions when features or SDKs change.
- Protect functionality from assuming a permission remains granted indefinitely.

## MUST NOT
- Request broad permissions solely for future convenience.
- Bypass platform permission controls using undocumented or deceptive techniques.
- Treat permission grant as authorization to use data for unrelated purposes.

## SHOULD
- Prefer narrower platform APIs, scoped storage, approximate data, or one-time access when sufficient.
- Provide useful degraded behavior when feasible.

## Exceptions
Broad or persistent permissions require documented necessity, alternatives considered, privacy/security impact, and approval.

## Verification
Inspect manifests, entitlements, runtime prompts, SDK declarations, permission-denial flows, revocation behavior, and store-facing disclosures.