# Cryptography Rules

## Purpose
Ensure cryptographic controls are selected, implemented, and operated safely.

## Scope
Applies to encryption, hashing, signatures, key derivation, certificates, and key lifecycle management.

## MUST
- Cryptographic algorithms and key sizes MUST follow current organizational or industry-approved standards.
- Keys MUST have defined ownership, storage, rotation, revocation, and recovery procedures.
- Passwords MUST use approved adaptive password-hashing functions with appropriate parameters.
- Certificate validation MUST verify trust, identity, validity, and revocation behavior where required.
- Cryptographic changes affecting production security MUST receive expert review.

## MUST NOT
- MUST NOT design custom cryptographic algorithms or protocols for production use.
- MUST NOT reuse nonces, IVs, salts, or keys contrary to algorithm requirements.
- MUST NOT disable certificate validation to resolve connectivity problems.

## SHOULD
- Prefer platform-provided, maintained cryptographic libraries.
- Prefer managed key services for high-value production keys.

## Exceptions
Any deviation requires documented rationale, threat analysis, expert approval, and compensating controls.

## Verification
Use code review, configuration inspection, crypto-policy checks, certificate tests, dependency review, and key-management audit evidence.