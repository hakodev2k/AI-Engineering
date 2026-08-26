# Authentication Enforcement

## Purpose
Ensure identities crossing the gateway boundary are validated consistently and fail closed.

## Scope
Tokens, sessions, API keys, certificates, identity providers, and authentication policy.

## MUST
- Protected routes MUST enforce an explicitly defined authentication policy before forwarding requests.
- Token signature, issuer, audience, validity period, and required claims MUST be validated as applicable.
- Authentication failure MUST fail closed with non-sensitive responses.
- Trust configuration and key rotation behavior MUST be tested.

## MUST NOT
- MUST NOT accept unsigned, expired, malformed, or untrusted credentials.
- MUST NOT log raw credentials, tokens, session identifiers, or private keys.
- MUST NOT disable authentication to resolve an availability problem without explicit security approval.

## SHOULD
- Authentication policy SHOULD be centrally testable while allowing route-specific requirements.
- Short-lived credentials and automated key refresh SHOULD be preferred.

## Exceptions
Any bypass requires documented scope, duration, compensating controls, risk acceptance, and security approval.

## Verification
Inspect policy configuration, run negative authentication tests, validate key rotation, scan logs for credential leakage, and test fail-closed behavior.