# Envelope Encryption and KMS Design

## Purpose
Design scalable encryption using data-encryption keys protected by centrally managed key-encryption keys.

## When to use
Use for application data, object storage, databases, multi-tenant services, and systems integrating cloud KMS or HSM-backed key management.

## Inputs
Data model, access patterns, tenancy, KMS capabilities, latency/availability targets, threat model, and rotation requirements.

## Context to inspect
Encryption boundaries, KMS IAM, key hierarchy, ciphertext metadata, caching, quotas, regional topology, backup/restore, and failure behavior.

## Core knowledge
Envelope encryption limits exposure and KMS traffic by encrypting data locally with a DEK and wrapping the DEK with a KEK. Ciphertext must carry enough authenticated metadata to identify algorithm, key version, nonce, and context without ambiguity.

## Procedure
1. Define encryption granularity and tenant boundaries.
2. Select AEAD and a versioned ciphertext format.
3. Define KEK hierarchy and KMS authorization.
4. Generate DEKs with a CSPRNG or KMS-supported mechanism.
5. Encrypt data with unique nonces and authenticated context.
6. Wrap DEKs and store only wrapped material with ciphertext.
7. Bound plaintext DEK lifetime and cache exposure.
8. Design KMS outage, throttling, and regional-failure behavior.
9. Define KEK rotation without unnecessary bulk data re-encryption.
10. Add audit, metrics, compatibility, and corruption tests.

## Decision points
Per-object DEKs maximize isolation but increase metadata; batched DEKs reduce overhead but enlarge blast radius. Cache unwrapped DEKs only with explicit latency-versus-exposure analysis.

## Common failure patterns
Using KMS directly for bulk data; missing authenticated metadata; nonce reuse; overly broad KMS IAM; unbounded DEK caches; ciphertext formats with no versioning.

## Verification
Test encrypt/decrypt, tamper rejection, key rotation, KMS denial, throttling, region failure, restore, and cross-version compatibility.

## Expected output
A versioned envelope-encryption architecture with key hierarchy, IAM, failure behavior, and migration strategy.

## Stop conditions
Stop if KMS permissions cannot enforce intended boundaries or ciphertext/key metadata cannot support safe future migration.