# Backup, Restore, and Recovery

## Purpose
Engineer and validate Windows recovery so backups are usable, recovery objectives are realistic, and restoration is practiced before incidents.

## When to use
Use for backup design, restore testing, disaster recovery planning, ransomware resilience, or failed-system recovery.

## Inputs
RPO/RTO, workload/data scope, backup technology, retention, offsite/immutable requirements, encryption, dependencies, and recovery environment.

## Preconditions
Define authoritative recovery objectives with service owners. A successful backup job is not proof of recoverability.

## Context to inspect
Backup coverage, schedules, failures, repositories, credentials, immutability/offline controls, system-state needs, application consistency, restore documentation, dependency order, and prior restore tests.

## Core knowledge
Recovery must cover data, configuration, identity, keys/certificates, and dependency ordering. Application-consistent backup differs from crash-consistent snapshots. AD/domain-controller recovery has special semantics.

## Procedure
1. Map service components and recovery dependencies.
2. Translate business RPO/RTO into backup frequency and restore architecture.
3. Confirm all critical data/configuration are protected.
4. Isolate backup administration and repositories from production compromise.
5. Define restore order and clean-environment requirements.
6. Perform representative restore tests, not only file browsing.
7. Measure achieved RPO/RTO.
8. Validate application integrity after restoration.
9. Record gaps and remediate them.
10. Repeat tests after architecture or backup changes.

## Decision points
Use snapshots for fast rollback only when they meet durability and consistency requirements; retain independent backups for disaster scenarios. Prioritize immutable/offline copies where ransomware risk warrants.

## Common failure patterns
Never testing restores, backing up data but not keys/configuration, shared privileged credentials, assuming VM snapshots are complete DR, undocumented dependency order, and measuring backup completion instead of recovery time.

## Verification
Restore representative systems/data into an isolated target, validate integrity and application function, measure time and recovery point, and prove required credentials/keys are available.

## Expected output
A tested recovery capability with measured objectives and known gaps.

## Stop conditions
Stop destructive restore operations without authoritative approval, when recovery would overwrite newer data unexpectedly, or when security incident handling requires forensic preservation first.