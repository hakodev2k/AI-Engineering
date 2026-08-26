# Media Security Rules

## Purpose
Protect media confidentiality, integrity, and endpoint trust.

## Scope
DTLS-SRTP, SRTP, key negotiation, certificates, media permissions, and secure transport.

## MUST
- Media MUST use authenticated encryption appropriate to the negotiated protocol.
- Certificate/fingerprint verification MUST fail closed on mismatch.
- Key material MUST be generated, stored, rotated, and destroyed using approved mechanisms.
- Security downgrade paths MUST be explicit and approved.

## MUST NOT
- MUST NOT transmit production media in plaintext across untrusted networks.
- MUST NOT log SRTP keys, private keys, bearer credentials, or reusable secrets.
- MUST NOT bypass certificate validation to restore connectivity.

## SHOULD
- Security-sensitive negotiation failures SHOULD emit sanitized, actionable telemetry.

## Exceptions
Any weaker transport requires security approval, isolated scope, compensating controls, and expiry.

## Verification
Inspect handshakes, configuration, packet captures, secret scans, negative certificate tests, and security review.