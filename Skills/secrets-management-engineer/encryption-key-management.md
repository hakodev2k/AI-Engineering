# Encryption Key Management

## Purpose
Manage encryption keys through generation, custody, usage, rotation, recovery, and destruction without confusing data-encryption keys with application secrets.

## When to use
Use when designing KMS/HSM integrations, envelope encryption, key rotation, or cryptographic custody controls.

## Inputs
- Data sensitivity and threat model
- Cryptographic use cases
- KMS/HSM capabilities
- Recovery and retention requirements

## Context to inspect
Inspect key hierarchy, algorithms, key aliases, grants, rotation settings, application integrations, encrypted data formats, backups, and audit logs.

## Core knowledge
Senior engineers distinguish key-encryption keys from data-encryption keys, limit raw key export, use envelope encryption, understand cryptoperiods, and preserve decryptability during rotation.

## Procedure
1. Classify each cryptographic use case and required key properties.
2. Select managed KMS or HSM custody according to threat and compliance needs.
3. Define key hierarchy and ownership.
4. Restrict key operations independently from key administration.
5. Integrate applications through encryption APIs rather than raw key retrieval where possible.
6. Define cryptoperiod and rotation behavior.
7. Preserve historical key versions required for decryption.
8. Test backup, recovery, disablement, and deletion safeguards.
9. Monitor key usage anomalies and failed operations.
10. Document destruction and retention rules.

## Decision points
Use HSM-backed keys when hardware assurance or non-exportability is required. Rotate key-encryption keys without unnecessary bulk data rewrite when envelope encryption supports rewrapping.

## Common failure patterns
- Exporting master keys into application configuration
- Deleting keys before dependent data expires
- Using one key across unrelated trust domains
- Treating key alias changes as cryptographic rotation
- Granting administrators decrypt permission by default

## Verification
Verify authorized encryption/decryption, denied unauthorized operations, historical ciphertext recovery, rotation behavior, and key-usage audit evidence.

## Expected output
A controlled key hierarchy with custody, permissions, rotation, recovery, monitoring, and destruction procedures.

## Stop conditions
Stop if key destruction risks unrecoverable business data, cryptographic requirements are undefined, or custody controls cannot meet the threat model.