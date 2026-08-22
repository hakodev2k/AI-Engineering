# Cryptography Usage Review

## Purpose
Review application and platform use of cryptography so confidentiality, integrity, authentication, and key lifecycle requirements are met using proven primitives.

## When to use
Use when adding encryption, signatures, password storage, tokens, certificates, key rotation, or when reviewing custom security-sensitive code.

## Inputs
Cryptographic requirements, data classification, code, protocols, libraries, key stores, certificate configuration, compatibility constraints.

## Context to inspect
Algorithms, modes, key sizes, randomness, nonces, password hashing, TLS configuration, certificate validation, key storage, rotation, and error handling.

## Core knowledge
Cryptography is easy to misuse. Prefer modern, well-reviewed libraries and protocols. Security depends on key management, randomness, parameter choices, authentication of ciphertext, certificate validation, and protocol context—not just algorithm names.

## Procedure
1. Identify the security property actually required: confidentiality, integrity, authenticity, or password verification.
2. Locate all cryptographic operations and key material.
3. Verify approved algorithms, modes, key lengths, and protocol versions.
4. Check randomness and nonce/IV generation requirements.
5. Ensure encryption includes integrity protection where needed.
6. Review password hashing parameters and migration strategy.
7. Validate certificate and hostname verification for TLS clients.
8. Review key storage, access controls, rotation, expiration, and revocation.
9. Remove obsolete or unnecessary custom cryptographic code.
10. Add interoperability and failure-path tests.

## Decision points
Prefer platform protocols such as TLS and established authenticated-encryption constructions over custom schemes. Escalate new protocol design to specialized cryptographers.

## Common failure patterns
Homegrown encryption, ECB mode, nonce reuse, weak password hashing, disabled certificate validation, hard-coded keys, unauthenticated ciphertext, and confusing encoding with encryption.

## Verification
Known test vectors or library interoperability tests pass, invalid certificates/signatures fail safely, keys are not exposed, and rotation/revocation procedures are demonstrated.

## Expected output
A cryptography usage assessment with unsafe patterns removed, approved primitives, sound key lifecycle, and verification evidence.

## Stop conditions
Stop and escalate for novel cryptographic protocol design, suspected key compromise, or changes that could make existing encrypted data unrecoverable.