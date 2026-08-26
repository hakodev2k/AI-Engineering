# Extensions and Major Upgrades

## Purpose
Manage PostgreSQL extensions and version upgrades with compatibility, rollback, and operational risk under control.

## When to use
Use for adding/updating extensions, minor/major PostgreSQL upgrades, or deprecation remediation.

## Inputs
Current/target versions, extension inventory, application drivers, topology, downtime budget, test results.

## Context to inspect
Release notes, deprecated behavior, extension compatibility, custom types/functions, replication, backups and deployment platform.

## Core knowledge
Major upgrades may require pg_upgrade, logical migration, dump/restore, or managed-service workflows. Extensions can constrain target versions and may execute privileged code.

## Procedure
1. Inventory server, client and extension versions.
2. Read all intervening release notes relevant to used features.
3. Verify extension/driver compatibility.
4. Choose upgrade method from size, downtime and rollback requirements.
5. Rehearse on a production-like copy.
6. Run application and query regression tests.
7. Validate backups and rollback/fallback path.
8. Schedule and execute with observability.
9. ANALYZE/rebuild objects where required.
10. Monitor post-upgrade plans and behavior.

## Decision points
Prefer pg_upgrade for fast compatible in-place transitions; logical migration when topology transformation or reduced cutover risk justifies complexity.

## Common failure patterns
Ignoring extension compatibility, no plan regression testing, assuming downgrade is possible, skipping statistics refresh.

## Verification
Validate version, extensions, schema/data, critical queries, performance, replication and recovery capability.

## Expected output
Compatibility matrix, upgrade runbook, test evidence and fallback plan.

## Stop conditions
Escalate when an extension lacks target-version support or no acceptable recovery path exists.