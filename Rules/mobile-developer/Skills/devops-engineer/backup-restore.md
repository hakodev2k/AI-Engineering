# Backup and Restore Engineering

## Purpose
Ensure critical systems can recover data within defined RPO and RTO targets.

## When to use
Use when designing backups, validating disaster recovery, changing retention, or preparing restore procedures.

## Inputs
Data stores, RPO/RTO, retention, legal requirements, encryption, geographic constraints.

## Context to inspect
Backup jobs, snapshots, PITR settings, replication, encryption keys, restore logs, retention policy, dependency order.

## Core knowledge
A backup is not proven until restored. Replication is not a backup against logical corruption. Protect backup credentials and keys independently from primary systems.

## Procedure
1. Classify data criticality.
2. Define RPO/RTO per dataset.
3. Select full/incremental/PITR strategy.
4. Isolate backup storage and access.
5. Encrypt and monitor backup jobs.
6. Define dependency-aware restore order.
7. Perform scheduled restore tests.
8. Measure actual restore duration and data loss window.
9. Document operator steps and automation.
10. Review retention and deletion compliance.

## Decision points
Use cross-region/account copies for major failure domains; increase backup frequency when business RPO justifies cost; retain immutable copies against ransomware.

## Common failure patterns
Successful backup jobs never restored, same-account compromise, missing encryption keys, undocumented dependency order, retention too short.

## Verification
Restore test succeeds into isolated environment and measured RPO/RTO meet targets.

## Expected output
Tested backup, retention, and recovery procedure with evidence.

## Stop conditions
Escalate if restore tests fail or required recovery objectives cannot be met.