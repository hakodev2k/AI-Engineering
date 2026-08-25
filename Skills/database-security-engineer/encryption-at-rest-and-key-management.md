# Encryption at Rest and Key Management

## Purpose
Protect stored database material and manage cryptographic keys as independent high-value assets.

## When to use
Use for database provisioning, regulated data, key rotation, backup design, or encryption-control reviews.

## Inputs
Storage architecture, database encryption features, key-management service, backup paths, replicas, data classification, and recovery requirements.

## Context to inspect
Inspect data files, logs, temporary storage, snapshots, replicas, exports, backups, and key policies.

## Core knowledge
Storage encryption mainly protects lost media and unauthorized storage access; it does not stop a compromised authorized database session. Key separation, rotation, availability, and recoverability are as important as encryption algorithms.

## Procedure
1. Map all persistent copies of sensitive data.
2. Identify native, storage, and application-level encryption controls.
3. Select approved algorithms and managed key services.
4. Separate key administration from database administration where feasible.
5. Restrict key-use permissions.
6. Define rotation and re-encryption behavior.
7. Protect backups and exports consistently.
8. Test restore with required keys.
9. Monitor key disablement, deletion, and access anomalies.

## Decision points
Use application or field-level encryption when database administrators must not see plaintext, accepting query and key-distribution complexity.

## Common failure patterns
Keys stored beside encrypted data, backups left unencrypted, destructive key rotation, missing restore tests, and claiming storage encryption provides row-level confidentiality.

## Verification
Inspect effective encryption status, key policies, audit logs, backup configuration, and a controlled restore.

## Expected output
A complete encryption and key-lifecycle design with recovery evidence.

## Stop conditions
Escalate before irreversible key deletion, unsupported re-encryption, or changes that could make backups unrecoverable.