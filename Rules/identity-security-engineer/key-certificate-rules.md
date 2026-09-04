# Key and Certificate Rules

## Purpose
Protect cryptographic material used to establish identity trust, sign tokens, authenticate services, and secure federation.

## Scope
Applies to signing keys, private keys, certificates, trust anchors, and key-management integrations used by identity systems.

## MUST
- Private keys MUST be stored in approved protected key-management systems appropriate to their impact.
- Key and certificate ownership, purpose, lifetime, and rotation procedure MUST be documented.
- Trust-anchor and signing-key changes MUST be validated before production rollout.
- Expiration and rotation events for critical identity keys MUST be monitored in advance.
- Compromised keys MUST be revoked or replaced using an approved containment plan.

## MUST NOT
- Private keys MUST NOT be committed to source repositories or copied through uncontrolled channels.
- Weak, deprecated, or unapproved algorithms MUST NOT be introduced into new identity trust paths.
- Key rotation MUST NOT assume all relying parties update atomically unless verified.

## SHOULD
- Prefer automated rotation with overlap periods where protocol and risk permit.
- Use hardware-backed protection for high-impact signing keys where appropriate.

## Exceptions
Exceptions require documented cryptographic constraint, risk, compensating controls, expiry, and approval.

## Verification
Inspect key stores, certificate inventories, expiry alerts, rotation tests, algorithm policy, trust metadata, and revocation procedures.