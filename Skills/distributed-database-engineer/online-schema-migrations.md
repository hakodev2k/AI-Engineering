# Online Schema Migrations

## Purpose
Change distributed schemas safely while old and new application versions coexist and data migrates incrementally.

## When to use
Use for column/type changes, index additions, table redesign, repartitioning, or compatibility-sensitive deployments.

## Inputs
Current/target schema, traffic volume, compatibility window, migration capabilities, rollback requirements.

## Context to inspect
Readers/writers, deployment order, schema metadata, backfill tools, replication, capacity headroom, and backups.

## Core knowledge
Safe migrations separate compatibility changes from cleanup. Expand-contract, resumable backfills, and explicit cutover criteria reduce risk. Distributed DDL can have topology-specific effects.

## Procedure
1. Inventory all readers and writers.
2. Define backward/forward compatibility.
3. Apply additive expand changes first.
4. Deploy compatible application behavior.
5. Backfill in bounded resumable batches.
6. Measure replication and resource impact.
7. Validate data equivalence.
8. Cut reads/writes to the new representation.
9. Observe through the rollback window.
10. Remove legacy schema only after dependency proof.

## Decision points
Use dual writes only when migration duration requires them and reconciliation is designed. Prefer native online operations when locking and replication semantics are understood.

## Common failure patterns
Destructive DDL first, unthrottled backfills, assuming simultaneous client deployment, non-resumable scripts, and premature cleanup.

## Verification
Validate mixed-version compatibility, compare old/new data, monitor cluster health during backfill, and rehearse rollback.

## Expected output
A phased migration plan, throttled execution, reconciliation evidence, rollback criteria, and cleanup gate.

## Stop conditions
Stop if destructive operations lack recovery proof, compatibility cannot be established, or cluster headroom is insufficient.