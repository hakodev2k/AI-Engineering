# Authentication Rules

## Purpose
Ensure backend services establish identity using trustworthy, verifiable mechanisms.

## Scope
User, service, workload, API, and machine authentication.

## MUST
- Authentication MUST validate credential authenticity, issuer, audience, expiry, and revocation semantics where applicable.
- High-risk access MUST use stronger authentication controls appropriate to the threat model.
- Session and token lifetime MUST be bounded and aligned with risk.
- Authentication failures MUST be observable without exposing credential details.

## MUST NOT
- MUST NOT accept unsigned, weakly signed, expired, or incorrectly scoped tokens.
- MUST NOT log passwords, bearer tokens, session secrets, or private keys.
- MUST NOT implement custom cryptographic authentication protocols when proven standards are available.

## SHOULD
- Prefer short-lived credentials and workload identity over static secrets.
- Authentication dependencies SHOULD fail closed for protected operations unless an explicitly designed degraded mode exists.

## Exceptions
Legacy mechanisms require documented risk, compensating controls, migration ownership, and expiry.

## Verification
Review token validation configuration, negative authentication tests, credential lifetimes, logs, and security scans.