# Rolling Upgrades and Format Evolution

## Purpose
Plan and execute storage-system upgrades without breaking mixed-version clusters, persisted data formats, replication protocols, or recovery paths.

## When to use
Use when changing on-disk formats, network protocols, metadata schemas, replication behavior, or deploying new storage binaries across a live cluster.

## Inputs
Current and target versions, compatibility matrix, persisted formats, protocol versions, feature flags, migration steps, rollback requirements, and cluster topology.

## Preconditions
Know which changes are backward compatible, forward compatible, one-way, or destructive before deployment begins.

## Context to inspect
Serialization and disk formats, protocol negotiation, metadata schema, snapshots, WAL compatibility, upgrade tooling, feature gates, node bootstrap, rollback code, and prior upgrade incidents.

## Core knowledge
A rolling upgrade is a period of deliberate heterogeneity. New code must usually read old data and interoperate with old peers until the fleet converges. Irreversible format writes or metadata changes should be delayed until rollback is no longer required. Compatibility is a graph across binary, protocol, metadata, and persisted-data versions.

## Procedure
1. Inventory all versioned interfaces and persisted formats affected.
2. Build a supported mixed-version compatibility matrix.
3. Separate code deployment from irreversible feature activation.
4. Add version negotiation or feature gates where required.
5. Ensure new binaries can read old persisted state.
6. Define when new-format writes become legal.
7. Define node-by-node or failure-domain-aware rollout order.
8. Set health gates for latency, errors, replication, and recovery.
9. Test upgrade interruption and resume.
10. Test rollback before irreversible migration is enabled.
11. Activate new behavior only after compatibility prerequisites are met.
12. Remove legacy readers/writers only in a later safe release.

## Decision points
Use dual-read or dual-write transitions when formats cannot change atomically. Prefer lazy migration when rewrite cost is large and both formats can coexist safely; prefer controlled eager migration when invariants require a uniform format.

## Common failure patterns
Writing a new format too early, changing protocol and persisted state simultaneously, assuming rollback works after irreversible metadata changes, upgrading all replicas of a shard together, and neglecting restored old backups.

## Verification
Run mixed-version integration tests, upgrade and rollback exercises, crash recovery at each transition, and restore tests using pre-upgrade data. Confirm no stage violates availability or durability policy.

## Expected output
An upgrade plan with compatibility matrix, rollout order, feature gates, irreversible boundaries, rollback strategy, and verification evidence.

## Stop conditions
Stop rollout when an unplanned incompatibility, unsafe migration, degraded redundancy, or rollback ambiguity is discovered.