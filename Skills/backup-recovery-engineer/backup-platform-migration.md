# Backup Platform Migration

## Purpose
Move protection workloads between backup products, repositories, accounts, or architectures without creating coverage gaps or losing historical recoverability.

## When to use
Use for vendor replacement, cloud migration, repository redesign, platform consolidation, or decommissioning.

## Inputs
Source and target platforms, protected inventory, retention requirements, historical backups, RTO/RPO, migration timeline, and licensing/cost constraints.

## Context to inspect
Inspect export/import compatibility, retention locks, encryption keys, catalog dependencies, bandwidth, old-format support, legal holds, and restore requirements for historical copies.

## Core knowledge
Backup migration is primarily a continuity problem. Historical copies often cannot be converted safely, so dual operation or retained legacy readers may be necessary until expiry.

## Procedure
1. Inventory policies, protected assets, historical copies, and legal holds.
2. Define migration success and decommission criteria.
3. Map source capabilities to target equivalents.
4. Establish target protection before removing source jobs.
5. Run parallel backups through at least a representative protection cycle.
6. Restore-test target backups.
7. Decide whether historical copies migrate, remain read-only, or expire naturally.
8. Preserve required keys, catalogs, and software to read legacy copies.
9. Reconcile coverage and recovery points.
10. Decommission source only after approved evidence.

## Decision points
Prefer dual-running when conversion risk is high. Keep legacy repositories isolated if migration cost exceeds value but retention obligations remain.

## Common failure patterns
Turning off source too early; assuming old backups import; losing legacy encryption keys; duplicate jobs overloading workloads; forgetting legal holds.

## Verification
Compare authoritative asset inventory against target coverage and successfully restore from both new and retained historical generations.

## Expected output
A migration with continuous protection and explicit historical-backup disposition.

## Stop conditions
Stop if target restore tests fail, historical retention obligations are unresolved, or source decommission would remove the only readable copy.