# Content Protection Rules

## Purpose
Protect media access and cryptographic boundaries without compromising playback availability or key confidentiality.

## Scope
Encryption, DRM integration, key delivery, signed access, entitlement boundaries, and protected media workflows.

## MUST
- Encryption and key-delivery flows MUST use approved cryptographic mechanisms and authenticated transport.
- Key identifiers, rotation behavior, entitlement checks, and failure modes MUST be explicit and testable.
- Secrets and content keys MUST be protected by least privilege and MUST NOT appear in logs, manifests, source code, or diagnostics unless the protocol explicitly exposes a non-secret identifier.
- Changes to trust roots, key rotation, DRM policy, or entitlement enforcement MUST require human approval.

## MUST NOT
- MUST NOT weaken access control or encryption merely to restore playback without authorized risk acceptance.
- MUST NOT reuse sensitive keys beyond their approved scope or lifetime.
- MUST NOT infer successful protection solely from successful playback.

## SHOULD
- Key rotation SHOULD minimize blast radius while preserving client compatibility.
- Protection failures SHOULD fail according to documented content policy rather than accidental defaults.

## Exceptions
Exceptions require security-owner approval, documented threat impact, compensating controls, and expiry.

## Verification
Use configuration inspection, access-control tests, secret scanning, negative entitlement tests, key-rotation exercises, and supported-client validation.