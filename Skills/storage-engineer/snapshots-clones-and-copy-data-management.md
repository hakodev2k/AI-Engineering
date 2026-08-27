# Snapshots, Clones, and Copy Data Management

## Purpose
Use snapshots and clones safely for recovery, testing, analytics, and data mobility without uncontrolled capacity or consistency risk.

## When to use
Use for point-in-time recovery, test environments, database copies, patch safety, and copy-data reduction.

## Inputs
Application consistency needs, snapshot technology, retention, change rate, capacity, clone consumers, and security requirements.

## Context to inspect
Copy-on-write/redirect-on-write behavior, dependency chains, quiescing hooks, snapshot schedules, replication interaction, and deletion semantics.

## Core knowledge
Snapshots are usually metadata-efficient point-in-time references, not independent backups. Their performance and capacity behavior depends on implementation and change rate. Application consistency may require quiescing or coordinated checkpoints.

## Procedure
1. Define recovery/use case and consistency requirement.
2. Determine snapshot implementation and dependency model.
3. Coordinate application/database quiescing when required.
4. Set retention from recovery objectives and change rate.
5. Monitor snapshot space and chain depth.
6. Secure clone access and sanitize sensitive data where needed.
7. Test restore and clone promotion.
8. Validate snapshot deletion impact.
9. Ensure independent backup exists for critical data.
10. Automate lifecycle cleanup with safeguards.

## Decision points
Use crash-consistent snapshots for workloads proven to recover safely; use application-consistent snapshots when transaction coordination matters. Use clones for rapid environments but treat them as production data from an access-control perspective.

## Common failure patterns
Snapshot sprawl, treating snapshots as backups, long dependency chains, no quiescing for sensitive databases, and cloning production PII into weakly controlled environments.

## Verification
Restore representative snapshots, validate application integrity, measure capacity impact, and confirm retention/cleanup policies execute correctly.

## Expected output
Snapshot/clone policy, consistency procedure, retention model, access controls, and restore evidence.

## Stop conditions
Stop before deleting parent snapshots or chains when dependency behavior is uncertain or no independent recovery copy exists.