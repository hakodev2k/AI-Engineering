# Authentication Rules

## Purpose
Protect API identities and sessions from impersonation and credential abuse.

## Scope
User, service, workload, token, key, certificate, and federated authentication.

## MUST
- Use approved identity mechanisms with explicit issuer, audience, signature, lifetime, and credential validation.
- Reject expired, malformed, untrusted, or context-inappropriate credentials before business logic executes.
- Apply stronger authentication to privileged or high-risk operations where risk requires it.
- Define credential revocation and compromise response.

## MUST NOT
- Implement custom cryptographic authentication when a vetted standard satisfies the requirement.
- Accept credentials from query strings when safer headers or protocol mechanisms are available.
- Log reusable credentials or bearer tokens.

## SHOULD
- Prefer short-lived, scoped credentials and workload identity over long-lived shared secrets.

## Exceptions
Legacy mechanisms require documented compatibility need, risk assessment, compensating controls, and migration plan.

## Verification
Use negative authentication tests, configuration inspection, token validation tests, secret scanning, and penetration testing.