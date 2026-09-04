# Device Trust Rules

## Purpose
Define how device posture contributes to access decisions without becoming an implicit trust shortcut.

## Scope
Applies to managed endpoints, mobile devices, privileged workstations, unmanaged devices, and device-attestation systems.

## MUST
- Device posture used for authorization MUST come from an identified authoritative source and MUST have defined freshness requirements.
- High-risk access MUST evaluate device security posture appropriate to the use case, including management state, supported OS, critical patch posture, encryption, and endpoint protection where relevant.
- Device identity and user identity MUST be evaluated independently and then combined by policy.
- Lost, stolen, compromised, retired, or noncompliant devices MUST be revocable from protected-resource access.
- Device-attestation failures and stale posture signals MUST have explicitly defined access behavior.
- Privileged administration SHOULD use hardened, separately managed administrative endpoints when feasible.

## MUST NOT
- Device enrollment alone MUST NOT confer broad trust.
- A corporate network address MUST NOT substitute for device posture verification.
- Stale device posture MUST NOT be treated as current indefinitely.
- Unmanaged-device exceptions MUST NOT expose sensitive data without compensating controls appropriate to the risk.

## SHOULD
- Policies SHOULD distinguish read-only, download, administrative, and destructive operations by device assurance level.
- Browser-isolation, restricted sessions, or virtualized access SHOULD be considered when business access from unmanaged devices is required.

## Exceptions
Exceptions require business justification, scope, asset classification, compensating controls, expiry, owner, and approval.

## Verification
Inspect endpoint-management, attestation, conditional-access, certificate, and revocation configurations. Test compliant, stale, compromised, unmanaged, and retired device cases and confirm resulting decisions match documented policy.