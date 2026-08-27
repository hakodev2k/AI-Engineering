# Encryption and Key Management

## Purpose
Apply SQL Server encryption controls with recoverable, auditable key lifecycle management.

## When to use
Use for TDE, backup encryption, column encryption, certificate rotation, or compliance requirements.

## Inputs
Data classification, threat model, compliance needs, SQL Server features/version, key custody requirements, recovery topology.

## Context to inspect
Inspect TDE state, certificates/asymmetric keys, master keys, backup encryption, Always Encrypted usage, replicas, restore destinations, and key backups.

## Core knowledge
Encryption without recoverable key custody can convert a failure into permanent data loss. TDE protects files at rest but not privileged query access; column/client-side approaches protect different boundaries.

## Procedure
1. Define the threat being mitigated.
2. Choose encryption layer matching that threat.
3. Establish key ownership, backup, escrow, and rotation procedure.
4. Implement in a test environment.
5. Measure performance and operational impact.
6. Validate backup/restore and replica procedures with keys.
7. Rotate using documented overlap/rollback steps.
8. Audit access to key material.

## Decision points
Use TDE for database-file protection, backup encryption for portable backup media, and client-side encryption when the database engine must not see plaintext for selected fields.

## Common failure patterns
Enabling TDE before backing up certificates, storing keys with encrypted backups, confusing encryption with authorization, and undocumented rotation dependencies.

## Verification
Restore encrypted backups to an isolated target using documented key recovery and validate intended plaintext access boundaries.

## Expected output
Encryption architecture, key inventory, recovery procedure, rotation plan, and test evidence.

## Stop conditions
Stop if key custody, backup, or recovery ownership is undefined.