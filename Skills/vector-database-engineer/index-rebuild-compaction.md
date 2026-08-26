# Index Rebuild and Compaction

## Purpose
Plan and execute index rebuilds, compaction, and maintenance without unacceptable downtime, data loss, or quality regression.

## When to use
Use after major deletes, index-parameter changes, fragmentation, corruption, model migrations, or engine upgrades.

## Inputs
Index type, corpus size, update/delete rate, maintenance features, capacity headroom, SLO, and rollback requirements.

## Context to inspect
Inspect fragmentation/deleted ratios, index health, build duration, temporary disk/RAM needs, replicas, snapshots, ingestion concurrency, and query load.

## Core knowledge
Maintenance can amplify CPU, memory, I/O, and storage. Rebuilds may alter ANN graph/layout and therefore performance. Online side-by-side builds reduce risk but require extra capacity.

## Procedure
1. Prove maintenance is necessary with health/performance evidence.
2. Estimate temporary resources and build duration on representative data.
3. Take/verify recovery point where appropriate.
4. Prefer side-by-side index creation when engine supports safe cutover.
5. Throttle or schedule around peak query/ingestion load.
6. Track build progress, errors, resource saturation, and replication.
7. Validate vector counts, versions, filters, recall, and latency on rebuilt index.
8. Cut over gradually or atomically with rollback.
9. Remove old artifacts only after observation window.

## Decision points
Compact in place when operation is proven online and resource-safe; rebuild side-by-side when parameters/schema change or rollback matters. Pause ingestion only if consistency cannot otherwise be guaranteed and downtime is approved.

## Common failure patterns
No temporary-space estimate; rebuild all replicas simultaneously; deleting old index immediately; ignoring ingestion during build; assuming rebuild preserves performance; maintenance during peak traffic.

## Verification
Compare counts/checksums, exact/ANN recall, filtered queries, p99 latency, and resource use before retirement of old index.

## Expected output
A maintenance plan, capacity estimate, validated replacement index, cutover and rollback record.

## Stop conditions
Stop if headroom is insufficient, backup/rollback is unverified, or maintenance would violate an unapproved availability window.