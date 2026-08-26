# Cryptography and Key Management Rules

## Purpose
Ensure cryptographic controls provide real protection and remain operable throughout their lifecycle.

## Scope
Encryption, signing, hashing, random generation, key creation, storage, rotation, revocation, and migration.

## MUST
- Use current, reviewed cryptographic primitives and platform or established library implementations.
- Generate cryptographic keys and nonces with cryptographically secure randomness and required uniqueness.
- Define key purpose, ownership, storage boundary, rotation, revocation, recovery, and migration behavior.
- Authenticate encrypted data when confidentiality and integrity are required.

## MUST NOT
- Design custom cryptographic algorithms or protocols for production security.
- Hard-code production secrets or private keys in application binaries.
- Reuse keys, IVs, or nonces contrary to the selected construction's security requirements.

## SHOULD
- Use hardware-backed non-exportable keys for high-value device credentials where supported.
- Version encrypted formats to permit safe migration.

## Exceptions
Legacy interoperability exceptions require documented exposure, migration plan, compensating controls, and security approval.

## Verification
Review algorithms, modes, parameters, key provenance, storage, rotation tests, randomness sources, failure handling, and migration paths.