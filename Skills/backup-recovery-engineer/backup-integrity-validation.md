# Backup Integrity Validation

## Purpose
Detect silent corruption, incomplete backup chains, unreadable media, and logical inconsistencies before an emergency restore depends on them.

## When to use
Use continuously for critical backups and after storage, software, encryption, or migration changes.

## Inputs
Backup catalog, checksums, database validation tools, application invariants, retention tiers, and restore-test environment.

## Context to inspect
Inspect backup software verification semantics: metadata validation is not necessarily payload validation. Identify chain dependencies and encrypted/compressed formats.

## Core knowledge
Integrity has multiple layers: object readability, cryptographic checksum, backup-format consistency, database consistency, and application-level correctness. No single checksum proves semantic recoverability.

## Procedure
1. Define integrity checks appropriate to each backup type.
2. Verify repository/object checksums where available.
3. Validate backup-chain completeness.
4. Periodically restore sampled backups to isolated environments.
5. Run native database/filesystem consistency checks.
6. Validate application-level invariants and representative records.
7. Sample across ages, tiers, regions, and media.
8. Track failures as protection incidents.
9. Quarantine suspect copies without destroying evidence.
10. Recreate protection chains when necessary.

## Decision points
Use full restore validation for critical datasets even when vendor verification reports success. Increase sampling after migrations, storage faults, or corruption incidents.

## Common failure patterns
Trusting catalog status; validating only newest backup; checksumming ciphertext without proving decryptability; deleting suspect copies before root-cause analysis.

## Verification
Produce evidence that sampled backups decrypt, read, restore, pass native consistency checks, and satisfy application invariants.

## Expected output
An integrity assurance process with measurable coverage and remediation.

## Stop conditions
Escalate immediately when no known-good copy exists, corruption spans multiple generations, or validation could modify evidence needed for incident investigation.