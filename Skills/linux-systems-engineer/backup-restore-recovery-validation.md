# Backup, Restore, and Recovery Validation

## Purpose
Engineer recoverability by proving Linux system and data restoration, not merely creating backups.

## When to use
Use for backup design, disaster-recovery reviews, migration preparation, ransomware resilience, or restore failures.

## Inputs
RPO/RTO, data classification, filesystem/application consistency requirements, backup platform, retention, encryption, and recovery environment.

## Context to inspect
Inspect what is backed up, exclusions, open-file/application consistency, credentials/keys, offsite/immutable copies, bandwidth, retention, and restore dependencies.

## Core knowledge
A successful backup job does not prove recoverability. Understand crash vs application consistency, snapshots, incremental chains, retention, encryption/key custody, immutability, and recovery sequencing.

## Procedure
1. Translate business RPO/RTO into backup and restore requirements.
2. Inventory critical data, configuration, identities, keys, and boot dependencies.
3. Choose consistency mechanism per workload.
4. Separate backup credentials and protect copies from host compromise.
5. Define retention and offsite/immutable strategy.
6. Automate backup monitoring.
7. Perform representative restores into isolated environment.
8. Validate integrity and application usability.
9. Measure actual RPO/RTO and close gaps.

## Decision points
Use snapshots for fast point-in-time capture but not as the only independent backup. Choose file-, volume-, or application-level methods based on consistency and recovery granularity.

## Common failure patterns
Never testing restores, backing up encrypted data without keys, snapshots on the same failure domain, missing metadata/ACLs, and RTO assumptions without timing tests.

## Verification
Restore succeeds from documented steps, integrity checks pass, application starts, permissions/metadata are correct, and measured RPO/RTO meet targets.

## Expected output
Validated recovery procedure, evidence, measured objectives, and identified gaps.

## Stop conditions
Stop destructive restore tests outside isolated/recovery targets or when encryption keys and authoritative recovery ownership are unavailable.