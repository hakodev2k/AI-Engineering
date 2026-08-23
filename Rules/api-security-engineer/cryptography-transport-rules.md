# Cryptography and Transport Rules

## Purpose
Ensure API confidentiality, integrity, and cryptographic trust use vetted controls.

## Scope
TLS, certificates, signatures, encryption, hashing, keys, and cryptographic protocol choices.

## MUST
- Require approved transport encryption for sensitive or authenticated API traffic.
- Use vetted algorithms, libraries, key sizes, and protocol versions consistent with current organizational security standards.
- Validate certificates and peer identity according to the trust model.
- Define key ownership, storage, rotation, revocation, and compromise procedures.

## MUST NOT
- Disable certificate validation to resolve connectivity problems.
- Design custom encryption or signature schemes without specialized security review.
- Store private keys or reusable secrets in source control.

## SHOULD
- Automate certificate and key lifecycle operations with auditable controls.

## Exceptions
Compatibility exceptions require documented risk, constrained exposure, expiry, and security approval.

## Verification
Inspect TLS configuration, certificate validation, key storage, dependency usage, scanners, and cryptographic test evidence.