# Spatial Schema and Data Migrations

## Purpose
Plan and execute geospatial schema, storage, CRS, and geometry migrations without losing data, breaking consumers, or causing unacceptable downtime.

## When to use
Use for geometry-type changes, CRS changes, table redesigns, format migrations, repartitioning, or spatial-engine upgrades.

## Inputs
Current and target schemas, data volume, consumer contracts, migration window, rollback requirements, accuracy tolerances.

## Context to inspect
Inspect dependencies, indexes, views, APIs, ETL jobs, SRIDs, geometry validity, storage size, replication, and current backup/restore capability.

## Core knowledge
Spatial migrations may require expensive rewrites, index rebuilds, reprojection, topology validation, and dual-read/write periods. A successful DDL statement is not proof of semantic equivalence.

## Procedure
1. Inventory all readers, writers, and derived products.
2. Define target schema and spatial invariants.
3. Estimate rewrite, index, and storage cost on a representative sample.
4. Choose offline, online, shadow-copy, or dual-write migration strategy.
5. Create backups or reversible checkpoints.
6. Transform data in bounded batches when scale requires it.
7. Validate counts, geometry validity, CRS, extents, and representative spatial results.
8. Rebuild and analyze spatial indexes.
9. Cut consumers over gradually where possible.
10. Monitor post-cutover correctness and retain rollback until confidence criteria pass.

## Decision points
Use shadow copies for high-risk semantic transformations. Prefer additive compatibility stages before destructive removals. Reproject once in a controlled pipeline rather than opportunistically across consumers.

## Common failure patterns
In-place destructive conversion, no disk-headroom estimate, dropping old columns before consumers migrate, unverified index rebuilds, and validating only row counts.

## Verification
Verify semantic equivalence on control features, spatial query results, counts, extents, performance, consumer compatibility, and rollback procedure.

## Expected output
A migration plan, execution evidence, cutover record, verification results, and defined rollback boundary.

## Stop conditions
Stop when rollback is impossible, storage headroom is insufficient, consumer ownership is unknown, or transformation accuracy cannot meet approved tolerances.