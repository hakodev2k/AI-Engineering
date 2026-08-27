# Backup Encryption and Key Management

## Purpose
Ensure backup confidentiality without creating a recovery dependency that makes protected data unusable when production keys or identity systems are lost.

## When to use
Use when implementing encryption at rest/in transit, customer-managed keys, key rotation, or recovery of encrypted workloads.

## Inputs
Data classification, encryption requirements, KMS/HSM architecture, backup platform, key policies, retention, and recovery scenarios.

## Context to inspect
Inspect key ownership, grants, rotation schedules, escrow/recovery procedures, regional availability, certificate dependencies, and audit logs.

## Core knowledge
Encryption is only recoverable if keys, metadata, credentials, and algorithms remain available for the lifetime of retained backups. Key deletion can be equivalent to backup deletion.

## Procedure
1. Classify backup data and required cryptographic controls.
2. Map each backup format to required keys and certificates.
3. Separate key administration from backup operations where appropriate.
4. Ensure key retention exceeds dependent backup retention.
5. Design protected key backup, escrow, or multi-region availability.
6. Test key rotation against old backup restores.
7. Restrict decrypt permissions to recovery workflows.
8. Audit key use, policy changes, and deletion scheduling.
9. Document emergency access and recovery dependencies.
10. Run restore tests during simulated production identity/KMS impairment.

## Decision points
Provider-managed keys reduce operational complexity; customer-managed keys provide control but increase recovery responsibility. Choose HSM-backed keys when policy or threat model requires stronger custody.

## Common failure patterns
Deleting retired keys too early; backing up ciphertext but not key metadata; recovery role lacks decrypt permission; circular dependency on unavailable production identity.

## Verification
Restore both recent and old encrypted backups with approved recovery identities and verify audit evidence for key access.

## Expected output
A key lifecycle aligned with backup retention and independently tested recovery.

## Stop conditions
Stop if key custody is undefined, retention conflicts with key deletion policy, or testing would expose key material outside approved boundaries.