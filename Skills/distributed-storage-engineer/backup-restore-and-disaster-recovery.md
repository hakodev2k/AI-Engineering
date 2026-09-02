# Backup, Restore, and Disaster Recovery

## Purpose
Design and verify backup and disaster-recovery capabilities that recover from logical corruption, operator mistakes, catastrophic infrastructure loss, and replication-wide failures.

## When to use
Use when defining RPO/RTO, implementing backup workflows, testing restore procedures, or reviewing disaster-recovery readiness. Replication alone is not sufficient.

## Inputs
Data criticality, RPO, RTO, retention requirements, dataset size, write rate, dependency graph, geographic requirements, encryption rules, and restore infrastructure.

## Preconditions
Identify the recovery unit, required consistency across datasets, and which external systems must be restored together.

## Context to inspect
Snapshot mechanics, incremental backup chains, transaction/log backups, object storage, encryption keys, manifests, retention policy, restore automation, and prior recovery exercises.

## Core knowledge
A backup is valuable only if it can be restored and validated. Recovery design must cover logical corruption that replication faithfully propagates. Point-in-time recovery depends on consistent snapshots plus ordered change logs. Recovery time includes provisioning, data transfer, replay, validation, and dependency restoration.

## Procedure
1. Define RPO and RTO per data class.
2. Identify consistency boundaries and dependency ordering.
3. Select full, incremental, snapshot, and log-based mechanisms.
4. Store backup copies in independent failure domains.
5. Protect manifests and encryption-key recovery paths.
6. Define retention, immutability, and expiration policies.
7. Automate restore into isolated environments.
8. Replay incremental/log data to the requested recovery point.
9. Validate checksums and application invariants.
10. Measure end-to-end restore time at realistic dataset scale.
11. Document failover and return-to-primary procedures.
12. Schedule recurring restore exercises and record gaps.

## Decision points
Use storage snapshots for fast capture when consistency semantics are understood; use logical or log backups when portability or point-in-time recovery matters. Maintain independent copies when correlated administrative failure is material.

## Common failure patterns
Backups never restored, missing keys, inconsistent multi-dataset snapshots, backup jobs silently lagging, restore time exceeding RTO, and backups stored in the same failure or administrative domain.

## Verification
Perform full restoration, validate data integrity and application behavior, measure achieved RPO/RTO, and test loss of the primary environment.

## Expected output
A recovery design and runbook with backup cadence, retention, validation, restore sequencing, measured recovery objectives, and unresolved risks.

## Stop conditions
Stop when a required recovery dependency, encryption key, or consistent restore point is unavailable.