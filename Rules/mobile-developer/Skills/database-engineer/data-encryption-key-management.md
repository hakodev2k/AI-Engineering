# Data Encryption and Key Management

## Purpose
Protect database confidentiality with appropriate transport, storage, column-level, and key-management controls.

## When to use
Use for sensitive data, regulatory requirements, new database platforms, key rotation, and encryption architecture reviews.

## Inputs
Data classification, threat model, compliance requirements, platform capabilities, key-management service, access model, and recovery needs.

## Context to inspect
Inspect TLS, storage encryption, backups, replicas, logs, client-side encryption, key hierarchy, rotation procedures, and administrative access.

## Core knowledge
Encryption does not replace authorization. The value of encryption depends on where keys live, who can use them, which threats are in scope, and whether recovery remains possible.

## Procedure
1. Classify data and define threats encryption must address.
2. Require authenticated encryption in transit.
3. Verify storage and backup encryption.
4. Decide whether selected fields require application/client-side or database-level encryption.
5. Separate key-management permissions from data access where practical.
6. Use managed key services or HSM-backed controls for high-value keys.
7. Define rotation and versioning without making old data unreadable.
8. Protect key backups and disaster-recovery procedures.
9. Prevent plaintext leakage through logs, exports, and temporary storage.
10. Test rotation and recovery.

## Decision points
Use transparent storage encryption for broad media protection; use field/client-side encryption when privileged database access must not expose plaintext, accepting query limitations and application complexity.

## Common failure patterns
Hard-coded keys, one key for every purpose, rotation without old-key access, encryption without integrity protection, and ignoring backups or logs.

## Verification
Validate TLS, ciphertext boundaries, key permissions, rotation, restore, and application behavior.

## Expected output
An encryption design tied to explicit threats with tested key lifecycle procedures.

## Stop conditions
Escalate when key custody is undefined, recovery keys are missing, or required cryptographic behavior is unsupported by approved platforms.