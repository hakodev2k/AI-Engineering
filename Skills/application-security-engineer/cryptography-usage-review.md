# Cryptography Usage Review

## Purpose
Ensure applications use established cryptographic primitives and key-management patterns correctly for the required security property.

## When to use
Use for encryption, signing, hashing, password storage, token construction, key derivation, or protocol design.

## Inputs
Threat requirements, crypto code, libraries, algorithms, key lifecycle, data formats, and compatibility constraints.

## Context to inspect
Inspect key generation, nonce/IV generation, authenticated data, serialization, rotation, error handling, and legacy compatibility.

## Core knowledge
Cryptography is easy to misuse. Prefer standardized protocols and high-level libraries. Confidentiality generally requires authenticated encryption; passwords require dedicated password hashing; signatures require explicit verification semantics.

## Procedure
1. State the exact security property and attacker capability.
2. Identify primitives, modes, parameters, and library versions.
3. Reject custom algorithms or protocol constructions unless formally justified and reviewed by specialists.
4. Verify randomness, nonce uniqueness, authentication, and key separation.
5. Review key storage, access, rotation, revocation, and backup.
6. Check algorithm agility and migration strategy.
7. Test tampering, wrong-key, malformed-input, and rotation cases.
8. Ensure errors do not create oracle behavior.

## Decision points
Use platform/library defaults when they meet requirements. Encrypt at application level only when infrastructure encryption does not satisfy the threat model. Hashing is not encryption.

## Common failure patterns
Static IVs, unauthenticated encryption, fast password hashes, reused keys across purposes, hard-coded keys, and accepting verification failures.

## Verification
Use known-answer or library interoperability tests, tamper tests, and key-rotation tests. Confirm configuration matches production.

## Expected output
Approved crypto construction or concrete remediation with migration and verification plan.

## Stop conditions
Escalate custom cryptographic protocol design, regulatory algorithm constraints, or irreversible data migration risk to qualified cryptography/security owners.