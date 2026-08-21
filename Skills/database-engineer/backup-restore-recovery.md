# Backup, Restore, and Recovery

## Purpose
Ensure database data can be recovered to agreed recovery objectives after corruption, deletion, infrastructure loss, or operator error.

## When to use
Use when designing backup policy, validating disaster readiness, changing retention, or responding to recoverability gaps.

## Inputs
RPO, RTO, database size, change rate, retention obligations, encryption requirements, topology, and available backup mechanisms.

## Context to inspect
Inspect existing schedules, backup destinations, retention, encryption keys, restore history, point-in-time capabilities, dependencies, and cross-region availability.

## Core knowledge
A backup is not proven until restoration succeeds. Recovery design must cover data, metadata, credentials/keys, dependencies, and the operational sequence needed to return service safely.

## Procedure
1. Confirm business RPO and RTO per data tier.
2. Inventory databases and recovery dependencies.
3. Select full, incremental/differential, log, snapshot, or managed backup mechanisms as appropriate.
4. Isolate backup failure domains from primary infrastructure.
5. Protect backups with encryption and least privilege.
6. Define retention and immutable/offline needs.
7. Automate backup failure alerts.
8. Perform scheduled restore drills into isolated environments.
9. Validate point-in-time and object-level recovery scenarios where required.
10. Record measured restore time and gaps against objectives.

## Decision points
Choose frequency from tolerated data loss, not convenience. Use snapshots for speed only when their failure-domain and consistency properties meet requirements.

## Common failure patterns
Never testing restores, storing backups with the same credentials/failure domain, missing encryption keys, and assuming managed service defaults satisfy business objectives.

## Verification
Restore from real backups, run integrity checks, validate application-readable data, and measure recovery duration.

## Expected output
A tested backup and recovery policy with evidence against RPO/RTO.

## Stop conditions
Escalate immediately when critical data lacks a restorable backup or required recovery keys are unavailable.