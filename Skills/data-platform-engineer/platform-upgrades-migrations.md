# Platform Upgrades and Migrations

## Purpose
Plan and execute data-platform upgrades and migrations with compatibility evidence, controlled blast radius, data reconciliation, and explicit rollback or forward-recovery paths.

## When to use
Use for engine upgrades, table-format/catalog changes, cloud/service migrations, major version changes, or platform consolidation.

## Inputs
Current/target versions, compatibility matrices, workloads, schemas, state, data volume, SLOs, deprecations, and maintenance constraints.

## Context to inspect
Dependency graph, client versions, custom plugins, state formats, deployment history, rollback limits, and representative workloads.

## Core knowledge
State and metadata migrations can make binary rollback impossible. Dual-run, shadow, canary, and expand/contract patterns reduce risk but increase temporary complexity. Correctness must be reconciled, not inferred from process success.

## Procedure
1. Inventory dependencies, consumers, and unsupported features.
2. Read release/deprecation notes and identify semantic changes.
3. Build compatibility tests with representative workloads and data.
4. Define migration waves and blast-radius boundaries.
5. Decide rollback versus forward-recovery before execution.
6. Back up state and prove restoration where applicable.
7. Run shadow/dual processing when correctness comparison is valuable.
8. Canary low-risk workloads first.
9. Compare outputs, performance, cost, and operational signals.
10. Expand gradually with checkpoints and stop criteria.
11. Decommission old paths only after rollback window and consumer migration are complete.

## Decision points
In-place upgrade is simpler when rollback is supported; parallel migration is safer for incompatible state or major architectural changes. Dual writes require careful reconciliation and should be temporary.

## Common failure patterns
Testing only startup, missing client compatibility, no state rollback, decommissioning too early, comparing row counts only, and migration backfills overwhelming production.

## Verification
Run compatibility, reconciliation, performance, failover, and restore tests; confirm all consumers have moved; observe target stability through an agreed window.

## Expected output
Migration plan, compatibility evidence, wave schedule, recovery strategy, reconciliation report, and decommission checklist.

## Stop conditions
Stop when backup restoration is unproven, incompatible consumers remain, reconciliation fails, or migration requires destructive action beyond approved scope.