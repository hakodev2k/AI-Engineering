# Identity Data Protection Rules

## Purpose
Protect identity attributes, authentication metadata, and access information according to sensitivity and legitimate use.

## Scope
Directory attributes, identity profiles, authentication telemetry, entitlement data, recovery data, and identity exports.

## MUST
- Identity data MUST be classified and access-controlled according to sensitivity and purpose.
- Collection and propagation of identity attributes MUST be limited to what downstream decisions actually require.
- Sensitive identity data in transit and at rest MUST use approved protections.
- Exports and diagnostic captures MUST have bounded access, retention, and disposal controls.

## MUST NOT
- MUST NOT expose unnecessary personal or security-sensitive attributes in tokens or client-visible claims.
- MUST NOT copy production identity datasets into lower environments without approved protection or transformation.
- MUST NOT retain authentication telemetry indefinitely without a documented requirement.

## SHOULD
- Prefer opaque stable identifiers over exposing mutable or sensitive identity attributes.

## Exceptions
Additional collection or retention requires purpose, necessity, risk/privacy review, retention period, and approval.

## Verification
Inspect claim sets, schemas, data flows, access controls, retention settings, exports, and lower-environment datasets.