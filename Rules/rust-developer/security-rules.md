# Security

## Purpose
Establish secure defaults for Rust software and prevent common application and systems vulnerabilities.

## Scope
Input handling, authentication integration, authorization, secrets, cryptography, filesystem/network access, and sensitive data.

## MUST
- Untrusted input MUST be validated at trust boundaries with explicit size and format limits.
- Secrets MUST come from approved secret mechanisms and MUST be excluded from source, logs, panic output, and diagnostics.
- Authorization MUST be enforced server-side or at the authoritative resource boundary.
- Cryptographic primitives MUST come from reviewed libraries and approved algorithms.
- Security-sensitive defaults MUST fail closed.

## MUST NOT
- MUST NOT disable certificate verification or security controls to unblock development.
- MUST NOT construct shell commands, paths, SQL, or protocols from untrusted input without safe APIs and validation.
- MUST NOT log authentication tokens, private keys, or sensitive payloads.

## SHOULD
- Apply least privilege and minimize exposed attack surface.
- Threat-model changes affecting trust boundaries.

## Exceptions
Security-control weakening requires explicit human approval, documented risk, scope, expiry, and compensating controls.

## Verification
Use threat review, static analysis, dependency scanning, security tests, configuration inspection, and targeted penetration testing.