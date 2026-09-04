# Database Engine Migration

## Purpose
Safely migrate databases when the target engine, managed service, version, or operating model differs from the source.

## When to use
Use for heterogeneous engine migrations, major-version upgrades combined with cloud moves, or adoption of managed database services.

## Inputs
Schema, stored code, extensions, SQL workload, query plans, data types, collations, transaction semantics, HA/DR requirements, performance baselines, and target service limits.

## Preconditions
A representative workload and compatibility assessment must be available. Application owners must support required code changes.

## Context to inspect
Inspect proprietary SQL, procedures, triggers, sequences, identity behavior, isolation levels, locking, indexing, partitioning, extensions, drivers, connection pooling, backup/restore, and operational tooling.

## Core knowledge
Syntax compatibility is only one dimension. Transaction semantics, optimizer behavior, collations, null ordering, timestamp handling, generated keys, and operational capabilities can change application behavior.

## Procedure
1. Inventory engine-specific features and dependencies.
2. Run schema/code compatibility analysis.
3. Classify findings by automatic conversion, manual rewrite, or architectural change.
4. Establish target parameter and capacity assumptions.
5. Convert schema in a controlled branch/environment.
6. Migrate representative data.
7. Run application integration and regression suites.
8. Capture target query plans and compare latency/throughput baselines.
9. Tune indexes, queries, pools, and parameters based on evidence.
10. Validate transactions, concurrency, failover, backup, and restore.
11. Rehearse production-scale migration and rollback.
12. Freeze incompatible schema changes during final migration window.
13. Cut over and monitor errors, waits, saturation, and correctness.

## Decision points
Stay on the same engine when compatibility risk outweighs managed-service benefits. Change engines when lifecycle, licensing, operational burden, or strategic capability justifies application change. Prefer evidence from workload replay over feature checklists.

## Common failure patterns
Assuming ANSI SQL means portability; missing collation differences; translating schema but not workload; no concurrency testing; copying source indexes blindly; overlooking driver behavior; performance testing without realistic data distribution.

## Verification
All critical queries and transactions pass correctness tests; target performance meets agreed SLOs; failover and restore are demonstrated; migration rehearsal fits the cutover window.

## Expected output
Compatibility report, remediation set, target tuning baseline, tested migration runbook, and rollback plan.

## Stop conditions
Escalate when required semantics cannot be reproduced, target limits invalidate the design, performance remains below requirements, or conversion risks data loss.