# Authenticated Encryption Design

## Purpose
Implement confidentiality and integrity with authenticated-encryption constructions and unambiguous message formats.

## When to use
Use when protecting application payloads, files, records, messages, or tokens outside an already sufficient standardized secure channel.

## Inputs
Threat model, payload sizes, nonce strategy, associated metadata, key hierarchy, streaming requirements, and compatibility constraints.

## Context to inspect
Existing ciphertext format, library APIs, nonce generation, key versions, serialization, error handling, and maximum message sizes.

## Core knowledge
AEAD protects plaintext and authenticates associated data. Nonce requirements are algorithm-specific and violations can catastrophically break security. Authentication must be verified before plaintext is trusted.

## Procedure
1. Confirm encryption is necessary and define protected boundaries.
2. Select an approved AEAD via a maintained library.
3. Design a versioned, length-safe ciphertext envelope.
4. Define key ID/version and nonce generation.
5. Bind stable contextual fields as associated data.
6. Enforce message and parameter limits.
7. Decrypt only after authentication succeeds.
8. Normalize externally visible failures to avoid oracle behavior.
9. Plan key/format migration.
10. Add tamper, truncation, replay-context, and compatibility tests.

## Decision points
Use record/chunk framing for large streams rather than one unbounded AEAD operation. Bind identifiers as associated data when substitution across records or tenants is a threat.

## Common failure patterns
Nonce reuse; encryption without authentication; ignoring tag failures; authenticating mutable fields incorrectly; exposing distinct decryption errors; no format version; trusting decrypted bytes before verification.

## Verification
Run known-answer tests where available, mutate every envelope component, test wrong keys/context, enforce nonce assumptions, and validate old/new format interoperability.

## Expected output
A safe AEAD design and implementation with explicit nonce, metadata, error, and migration rules.

## Stop conditions
Stop if nonce uniqueness/unpredictability requirements cannot be guaranteed or if a custom cryptographic construction would be required.