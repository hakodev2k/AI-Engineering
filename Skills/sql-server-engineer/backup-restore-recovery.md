# Backup, Restore, and Recovery

## Purpose
Design and verify SQL Server recovery capability against explicit RPO and RTO requirements.

## When to use
Use for backup strategy, disaster recovery readiness, restore testing, or recovery incidents.

## Inputs
RPO/RTO, database size/change rate, recovery model, backup history, storage, encryption keys, retention requirements.

## Context to inspect
Inspect full/differential/log chains, copy-only usage, CHECKSUM, encryption, off-host storage, restore throughput, AG/log-shipping interactions, and msdb history.

## Core knowledge
A successful backup job is not proof of recoverability. Recovery point and recovery time are properties of a tested restore chain and operating procedure.

## Procedure
1. Define per-database RPO/RTO.
2. Select recovery model intentionally.
3. Design full, differential, and log cadence.
4. Enable integrity checks and secure backup encryption/keys.
5. Store copies across appropriate failure boundaries.
6. Monitor backup age and failures.
7. Perform automated restore tests.
8. Time representative recovery drills.
9. Document point-in-time and tail-log procedures.

## Decision points
Use FULL recovery when point-in-time recovery is required and log operations are supported; SIMPLE when that requirement does not exist and data-loss tolerance permits it.

## Common failure patterns
Never testing restores, losing encryption certificates, broken log chains, backups on the same failure domain, and RTO assumptions based only on backup duration.

## Verification
Restore to an isolated environment, run consistency checks, validate application-level data, and measure achieved RPO/RTO.

## Expected output
A tested recovery runbook, backup policy, alerting thresholds, and drill evidence.

## Stop conditions
Stop destructive restore actions against production unless an approved recovery incident explicitly requires them.