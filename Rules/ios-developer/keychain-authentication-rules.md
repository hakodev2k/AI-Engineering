# Keychain and Authentication Rules

## Purpose
Ensure authentication material is handled with correct lifecycle, access control, and recovery semantics.

## Scope
Keychain items, tokens, biometric gates, session state, refresh flows, and sign-out.

## MUST
- Authentication tokens MUST have explicit storage, expiry, refresh, revocation, and sign-out behavior.
- Keychain accessibility class MUST match the threat model and required device-lock behavior.
- Biometric checks MUST be treated as local access gates, not proof of server authorization.
- Sign-out MUST clear or invalidate sensitive local session material as defined by the product threat model.
- Refresh races MUST be serialized or otherwise designed to prevent token corruption and request storms.

## MUST NOT
- MUST NOT log tokens, credentials, recovery codes, or Keychain payloads.
- MUST NOT persist passwords when token-based or platform-mediated authentication is available.
- MUST NOT assume reinstall, backup, restore, or device migration semantics without testing them.

## SHOULD
- Prefer short-lived access tokens and narrowly scoped credentials.
- Design authentication failures as explicit states with safe recovery.

## Exceptions
Alternate credential storage requires security approval and evidence that equivalent protection is achieved.

## Verification
Inspect Keychain attributes, test expiry/refresh/revocation/sign-out, exercise biometric fallback, scan logs, and validate server-side authorization independently of client state.