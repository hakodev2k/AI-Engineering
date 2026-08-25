# Snapshot and Clone Management

## Purpose
Use snapshots and clones safely for recovery, testing, analytics, and rapid provisioning while controlling consistency, dependency chains, and capacity growth.

## When to use
Use when defining snapshot policies, creating writable clones, investigating snapshot-related performance, or supporting fast rollback.

## Inputs
Application consistency needs, retention, change rate, recovery objectives, clone use cases, capacity model, and platform semantics.

## Preconditions
Understand whether snapshots are crash-consistent, application-consistent, copy-on-write, redirect-on-write, or full-copy.

## Context to inspect
Snapshot schedules, dependency trees, changed-block tracking, clone relationships, replication, backups, retention jobs, and capacity alarms.

## Core knowledge
Snapshots are point-in-time references, not inherently independent backups. Long chains and high change rates can increase capacity and performance cost. Deleting a snapshot may trigger expensive merge/reclaim work.

## Procedure
1. Define recovery/provisioning use case.
2. Determine required consistency mechanism.
3. Set frequency and retention from RPO and change rate.
4. Model worst-case snapshot space.
5. Define clone ownership and expiry.
6. Coordinate with replication/backup.
7. Test snapshot creation under load.
8. Restore and validate application consistency.
9. Test deletion/reclaim behavior.
10. Monitor chain depth, age, and capacity.

## Decision points
Use application quiescing when crash consistency is insufficient. Promote/materialize clones when long dependency chains create operational risk.

## Common failure patterns
Calling snapshots backups, unlimited retention, orphaned clones, snapshot storms, capacity exhaustion, and restoring without application consistency checks.

## Verification
Create, restore, clone, delete, and reclaim in a representative environment; verify data correctness and capacity/performance impact.

## Expected output
A snapshot/clone policy with consistency, retention, lifecycle, monitoring, and tested recovery procedures.

## Stop conditions
Stop if snapshot semantics are undocumented, capacity headroom is inadequate, or deletion could remove the only recoverable copy.
