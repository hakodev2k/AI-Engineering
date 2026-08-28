# Migration and Zero-Downtime Cutover

## Purpose
Plan Oracle migrations with controlled data movement, validation, synchronization, cutover, and rollback while minimizing downtime and data risk.

## When to use
Use for platform/cloud migration, endian/version changes, consolidation, replatforming, or low-downtime upgrades.

## Inputs
Source/target versions and platforms, dataset size/change rate, downtime target, network bandwidth, feature compatibility, RPO/RTO.

## Context to inspect
Data Pump, RMAN transport/duplicate, transportable tablespaces, GoldenGate or replication options, character sets, time zones, LOBs, sequences, jobs, links, grants, and application connection switching.

## Core knowledge
The migration mechanism should follow transformation need, data volume, change rate, and downtime tolerance. Zero downtime is an end-to-end application property, not only a replication feature.

## Procedure
1. Inventory schemas, objects, features, dependencies, and incompatibilities.
2. Establish source data size, change rate, and downtime budget.
3. Select bulk-load and delta-sync mechanisms.
4. Rehearse full migration with production-like volumes.
5. Validate row/object counts, checksums or business aggregates, privileges, jobs, and sequences.
6. Define write-freeze or final synchronization semantics.
7. Prepare application routing, DNS/service, and connection-pool changes.
8. Set explicit cutover and rollback gates.
9. Monitor replication lag and target health during transition.
10. Retain source safely until acceptance and rollback window close.

## Decision points
Use logical migration when transformation/selectivity is needed; physical methods when speed and compatibility dominate; replication when downtime must be minimized.

## Common failure patterns
Ignoring non-table objects, sequence divergence, hidden character-set issues, no rollback after writes begin, and calling replication alone zero downtime.

## Verification
Complete rehearsal, reconcile data and objects, run application tests, and prove rollback procedure.

## Expected output
A migration runbook with validation, cutover, and rollback evidence.

## Stop conditions
Stop when reconciliation, synchronization, or rollback cannot meet agreed data-loss limits.