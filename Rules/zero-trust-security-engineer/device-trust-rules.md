# Device Trust Rules

## Purpose
Define how device posture contributes to access decisions without treating device ownership as sufficient trust.

## Scope
Applies to managed endpoints, BYOD, servers, mobile devices, browsers, and device-attestation signals.

## MUST
- Device trust MUST be based on verifiable posture signals relevant to the requested access.
- High-value access MUST distinguish managed, compliant, unknown, and compromised devices.
- Device posture signals MUST have defined freshness and failure behavior.
- Lost, retired, or compromised devices MUST be revocable from protected access promptly.

## MUST NOT
- MUST NOT grant sensitive access solely because a device is on a corporate network.
- MUST NOT treat stale posture data as current evidence.
- MUST NOT expose unnecessary device telemetry to applications.

## SHOULD
- Controls SHOULD degrade access proportionally rather than relying only on binary allow/deny when business needs justify it.
- Device identifiers SHOULD resist trivial spoofing.

## Exceptions
Unsupported platforms require documented residual risk, alternate controls, scope, owner, and expiry.

## Verification
Inspect endpoint-management policy, attestation validation, access-policy conditions, revocation timing, and tests covering stale posture, unmanaged devices, compromised state, and signal-provider failure.