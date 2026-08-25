# Backup and Recovery Security

## Purpose
Protect backups from theft, tampering, ransomware, and unrecoverable key or credential dependencies.

## When to use
Use for backup architecture, recovery testing, ransomware resilience, retention changes, or access reviews.

## Inputs
Backup topology, schedules, storage policies, encryption keys, retention requirements, restore procedures, and access roles.

## Context to inspect
Inspect snapshots, logical dumps, transaction logs, replicas used for recovery, offsite copies, immutability, deletion permissions, and key dependencies.

## Core knowledge
A backup is both a recovery asset and a sensitive copy of production data. Security requires confidentiality, integrity, isolation, retention, and tested recoverability.

## Procedure
1. Inventory all backup forms and locations.
2. Apply classification-equivalent access controls.
3. Encrypt backups and protect keys independently.
4. Separate backup deletion authority from routine database administration where feasible.
5. Use immutability or protected retention for critical recovery points.
6. Secure transfer paths.
7. Define authorized restore environments.
8. Perform periodic restore tests.
9. Verify restored data, permissions, and audit controls.

## Decision points
Choose immutable storage based on ransomware threat and recovery objectives. Logical dumps aid portability but can expose plaintext and metadata more readily than managed snapshots.

## Common failure patterns
Backups readable by broad operators, untested restores, keys deleted before retention expires, production data restored to insecure test systems, and backup deletion sharing the same compromised credentials.

## Verification
Complete a controlled restore from protected media and validate integrity, keys, access, and recovery objectives.

## Expected output
A secure, tested backup and recovery control set.

## Stop conditions
Escalate before retention reduction, destructive key changes, or restore operations involving sensitive production data without authorization.