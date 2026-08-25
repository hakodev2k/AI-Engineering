# Local Storage and Retention

## Purpose
Design bounded, durable local storage for edge workloads that must survive outages, restarts, and constrained disks.

## When to use
Use for buffered telemetry, local databases, media, caches, audit logs, or offline transactions.

## Inputs
Data classes, write rates, retention needs, disk capacity, endurance characteristics, recovery requirements.

## Context to inspect
Inspect filesystems, database engines, partitioning, write amplification, cleanup jobs, encryption, and disk-pressure behavior.

## Core knowledge
Senior edge storage design balances durability, retention, flash wear, corruption recovery, write amplification, encryption, and predictable behavior near capacity.

## Procedure
1. Classify data by durability and retention requirement.
2. Forecast steady and peak storage growth.
3. Reserve capacity for system recovery and updates.
4. Choose storage engines appropriate to access patterns.
5. Define retention and compaction rules.
6. Bound caches and temporary files.
7. Protect critical durable data from optional data growth.
8. Encrypt sensitive data where required.
9. Define corruption detection and recovery.
10. Monitor free space, write rates, and cleanup effectiveness.

## Decision points
Use embedded databases for transactional local state; use append-oriented files for simple high-rate streams when query requirements are low.

## Common failure patterns
Disk-full crashes, infinite logs, no reserved recovery space, excessive flash writes, cleanup deleting unsynchronized data.

## Verification
Fill storage toward thresholds, restart during writes, simulate corruption, and verify retention, recovery, and protected critical data.

## Expected output
A bounded local-storage design with durability, retention, cleanup, encryption, and recovery rules.

## Stop conditions
Stop when required retention exceeds available storage without an approved loss or offload policy.