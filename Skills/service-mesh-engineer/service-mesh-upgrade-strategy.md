# Service Mesh Upgrade Strategy

## Purpose
Upgrade mesh control/data planes with bounded version skew, blast radius and rollback time.

## When to use
Use for routine releases, security patches or proxy/control-plane migrations.

## Inputs
Current/target versions, compatibility matrix, workload inventory, maintenance constraints and rollback objectives.

## Context to inspect
Deprecated APIs, CRDs, webhooks, proxy versions, revisions, gateway versions and release notes.

## Core knowledge
Mesh upgrades can alter protocol behavior and generated proxy config. Control-plane rollback does not automatically downgrade already restarted proxies. CRD/schema changes may be one-way.

## Procedure
1. Read breaking changes and supported skew.
2. Inventory deprecated configuration.
3. Back up declarative state and validate restore paths.
4. Install target revision alongside current where supported.
5. Upgrade test and low-risk workloads first.
6. Compare config, telemetry and SLOs.
7. Progress by bounded cohorts.
8. Upgrade gateways with explicit capacity protection.
9. Keep old revision until rollback window closes.
10. Remove obsolete revisions only after fleet convergence.

## Decision points
Use revision/canary upgrades when supported; in-place upgrades are acceptable only with proven rollback and low blast radius.

## Common failure patterns
Fleet-wide restart, unsupported skew, deleting old CRDs/revisions early, gateway capacity loss and assuming healthy pods mean equivalent behavior.

## Verification
Check version inventory, traffic SLOs, config convergence, rollback rehearsal and absence of deprecated resources.

## Expected output
A staged upgrade plan with gates and rollback.

## Stop conditions
Stop on unknown compatibility, irreversible schema change without approval, or missing rollback capacity.