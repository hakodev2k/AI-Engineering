# Token Validation Safety Rules

## MUST
- Verify JWT signature and key provenance in the application, gateway, or identity middleware before using this package's claim gate.
- Require an explicit issuer allowlist and at least one explicit audience.
- Treat missing or mismatched audience, issuer, expiry, client identity, and required scopes/roles as blocking failures.
- Preserve evidence for rejected tokens without logging raw tokens or secret-bearing headers.
- Require explicit human approval before weakening production validation policy.

## MUST NOT
- Accept `aud=*`, substring audience matching, or issuer prefix matching.
- Decode a JWT and treat successful decoding as authentication.
- Log raw access tokens, refresh tokens, client secrets, or signing keys.
- Automatically add scopes, permissions, or identity-provider grants to make a check pass.
- Disable signature, expiry, issuer, or audience validation to recover from an incident.

## SHOULD
- Use the platform identity middleware for cryptographic validation and this gate for deterministic policy verification.
- Keep service-specific scopes minimal and separate read/write/admin privileges.
- Record policy version, client identity, audience, and rejection code in safe audit output.
