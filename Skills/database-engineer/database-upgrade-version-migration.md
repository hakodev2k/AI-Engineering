# Database Upgrade and Version Migration

## Purpose
Move database engines or major versions safely while preserving correctness, compatibility, performance, and recoverability.

## When to use
Use for major-version upgrades, managed-service migrations, engine replacements, end-of-support remediation, and compatibility-level changes.

## Inputs
Source/target versions, feature inventory, schema, workload, drivers, extensions, compatibility changes, topology, downtime constraints, and rollback objectives.

## Context to inspect
Inspect deprecated features, SQL behavior changes, collation/time semantics, client drivers, stored code, plans, backup formats, replication, extensions, and operational tooling.

## Core knowledge
Successful upgrades validate behavior and workload, not merely data transfer. Optimizer, defaults, authentication, and operational commands can change even when schema remains valid.

## Procedure
1. Inventory engine-dependent features and integrations.
2. Read target compatibility and breaking-change guidance.
3. Build a representative target environment.
4. Restore or replicate realistic data.
5. Run integrity and application regression suites.
6. Benchmark critical queries and maintenance operations.
7. Test backup/restore, monitoring, failover, and administration.
8. Choose in-place, blue-green, replication-based, or export/import migration strategy.
9. Define cutover, validation, rollback, and decision deadlines.
10. Monitor closely after migration and retain rollback capability for the agreed window.

## Decision points
Prefer side-by-side migration when rollback and rehearsal matter more than infrastructure cost. In-place upgrades can be simpler but usually offer less rollback flexibility.

## Common failure patterns
Testing only schema creation, ignoring query-plan regressions, unsupported drivers, no rollback deadline, and discovering operational-tool incompatibility during cutover.

## Verification
Compare data counts/checks, application tests, critical-query performance, backup/restore, monitoring, and failover behavior.

## Expected output
A rehearsed migration plan with compatibility evidence, cutover gates, and rollback strategy.

## Stop conditions
Stop for unresolved data incompatibility, unsupported critical features, or inability to meet recovery requirements.