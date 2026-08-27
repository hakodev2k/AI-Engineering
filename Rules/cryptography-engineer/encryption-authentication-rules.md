# Encryption and Authentication Rules

## Purpose
Ensure protected data has the confidentiality and integrity guarantees the design claims.

## Scope
Authenticated encryption, MACs, envelope encryption, and protected message formats.

## MUST
- Use authenticated encryption when both confidentiality and integrity are required.
- Authenticate security-relevant associated metadata when it influences interpretation, routing, identity, or authorization.
- Validate authentication before releasing or acting on untrusted plaintext.

## MUST NOT
- Use unauthenticated encryption for attacker-controlled data paths requiring integrity.
- Reuse a key/nonce pair under constructions requiring uniqueness.
- Expose distinguishable decryption failures that create practical oracles.

## SHOULD
- Use established AEAD APIs with safe defaults.

## Exceptions
Legacy interoperability requires bounded exposure, compensating integrity controls, migration plan, and approval.

## Verification
Test tampering, replay assumptions, nonce handling, malformed ciphertext behavior, and cross-implementation vectors.