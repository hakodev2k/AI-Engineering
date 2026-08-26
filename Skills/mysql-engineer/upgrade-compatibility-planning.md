# Upgrade and Compatibility Planning

## Purpose
Upgrade MySQL versions with controlled application, SQL, replication, and operational compatibility risk.

## When to use
Use for major/minor upgrades, managed-service engine changes, or end-of-support remediation.

## Inputs
Current/target versions, topology, SQL workload, plugins, drivers, configuration, maintenance constraints.

## Context to inspect
Release notes, removed/deprecated features, reserved words, defaults, authentication, collations, optimizer behavior, replication compatibility, backup tooling.

## Core knowledge
Version upgrades can change optimizer plans, defaults, metadata, authentication, and replication behavior even when schema is unchanged. Rollback after on-disk upgrade may require restore rather than binary downgrade.

## Procedure
1. Inventory server, clients, plugins, tooling, and unsupported features.
2. Review target-version incompatibilities and changed defaults.
3. Run vendor upgrade checks.
4. Restore production-like data into target version.
5. Replay representative read/write workload.
6. Compare plans and performance for critical queries.
7. Test backup/restore, replication, failover, and monitoring.
8. Define rolling/in-place/blue-green sequence.
9. Establish rollback boundary and backups.
10. Upgrade with staged observation before broad rollout.

## Decision points
Prefer blue-green or replica-first upgrades when rollback flexibility and capacity justify it. Use in-place upgrades only with a tested recovery path.

## Common failure patterns
Reading only headline release notes, ignoring drivers, assuming downgrade is possible, missing reserved-word conflicts, and skipping query-plan comparison.

## Verification
Pass compatibility tests, workload benchmarks, recovery/failover drills, and post-upgrade error/latency monitoring.

## Expected output
Upgrade plan with incompatibility register, test evidence, sequencing, and rollback strategy.

## Stop conditions
Stop on unsupported dependencies, unexplained performance regressions, failed upgrade checks, or no viable recovery path.