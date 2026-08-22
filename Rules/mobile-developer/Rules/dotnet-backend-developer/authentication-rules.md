# Authentication Rules

## Purpose
Ensure identities are established using secure, explicit, and verifiable mechanisms.

## Scope
Applies to user authentication, service authentication, tokens, cookies, API keys, and external identity providers.

## MUST
- Authentication mechanisms MUST use established platform standards and validated token/signature processing.
- Token issuer, audience, lifetime, signature, and required claims MUST be validated where applicable.
- Credentials and secrets MUST be stored outside source code and protected by least-privilege access.
- Authentication failures MUST be distinguishable from authorization failures without leaking sensitive detail.
- Service-to-service identities MUST be independently identifiable and auditable.

## MUST NOT
- MUST NOT trust unsigned, expired, malformed, or incorrectly scoped tokens.
- MUST NOT log passwords, bearer tokens, refresh tokens, secrets, or credential material.
- MUST NOT invent custom cryptographic authentication protocols when established standards fit.

## SHOULD
- Prefer managed identity or short-lived credentials over long-lived static secrets where available.
- Prefer centralized authentication configuration with explicit environment validation.

## Exceptions
Any nonstandard mechanism requires threat analysis, security review, migration/rotation plan, and approval.

## Verification
Use security tests, configuration inspection, token-validation tests, dependency review, and audit-log inspection.