# Patching and Upgrades

## Purpose
Plan and execute Oracle Database and Grid Infrastructure patching/upgrades with dependency analysis, rollback planning, and workload validation.

## When to use
Use for RUs/RURs, security fixes, one-off patches, major version upgrades, or Grid/RAC maintenance.

## Inputs
Current versions/inventory, target release, support matrix, application dependencies, downtime allowance, HA topology, rollback requirements.

## Context to inspect
OPatch inventory, conflicts, datapatch status, invalid objects, timezone/components, client compatibility, deprecated features, optimizer changes, backup/restore readiness.

## Core knowledge
Patch success means more than installer completion: binaries, dictionary SQL, services, application behavior, plans, and recovery all need validation.

## Procedure
1. Inventory database, Grid, client, and component versions.
2. Review patch notes, prerequisites, conflicts, and known issues.
3. Confirm certified OS, driver, and application compatibility.
4. Capture configuration, invalid objects, plans, and performance baseline.
5. Verify current backup and rollback/recovery options.
6. Rehearse in a production-like environment.
7. Patch using supported order and rolling method where applicable.
8. Run datapatch/component checks and inspect logs.
9. Execute smoke, integration, and critical performance tests.
10. Monitor after release and retain explicit rollback criteria.

## Decision points
Use rolling maintenance only when component and topology support it. Upgrade optimizer behavior deliberately rather than assuming newer is always faster.

## Common failure patterns
Skipping conflict analysis, missing datapatch, no client compatibility test, no plan baseline, and discovering rollback is impossible after cutover.

## Verification
Validate inventory, dictionary patch registry, cluster/database health, critical SQL, and application acceptance tests.

## Expected output
A tested patch/upgrade plan, executed evidence, and rollback record.

## Stop conditions
Stop when backup/rollback, compatibility, or production-like rehearsal is insufficient.