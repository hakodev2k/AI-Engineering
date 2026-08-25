# Security Rules

## Purpose
Establish secure defaults for Go applications and services.

## Scope
Input handling, authentication boundaries, authorization, cryptography, secrets, dependencies, and sensitive data.

## MUST
- Untrusted input MUST be validated at trust boundaries.
- Authorization MUST be enforced server-side for every protected operation.
- Secrets MUST come from approved secret-management mechanisms and remain out of source and logs.
- Cryptography MUST use maintained standard or approved libraries and secure parameters.
- Security-sensitive dependencies MUST be tracked and patched according to risk.

## MUST NOT
- MUST NOT disable TLS verification, authentication, authorization, or validation merely to unblock work.
- MUST NOT log credentials, tokens, private keys, or sensitive payloads.
- MUST NOT implement custom cryptographic primitives.

## SHOULD
- Apply least privilege to identities and data access.
- Prefer secure defaults that require explicit opt-out.

## Exceptions
Weakening a control requires documented threat impact, compensating controls, expiry, and human approval.

## Verification
Security tests, dependency/vulnerability scanning, secret scanning, configuration inspection, threat review, and targeted code review.