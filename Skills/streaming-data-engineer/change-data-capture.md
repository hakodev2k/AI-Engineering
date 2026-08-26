# Change Data Capture

## Purpose
Capture database changes reliably while preserving source correctness and minimizing coupling to physical schemas.

## When to use
Use for CDC pipelines, database-to-stream integration, or CDC lag/schema incidents.

## Inputs
Source database, tables, keys, transaction log capabilities, snapshot requirements, downstream semantics.

## Context to inspect
Replication slots/log retention, connector offsets, schema changes, transaction boundaries, deletes, snapshots.

## Core knowledge
Log-based CDC is usually lower-impact and more complete than polling but introduces operational dependencies on database logs and connector state. CDC records are database changes, not automatically domain events.

## Procedure
1. Define downstream purpose and ownership.
2. Validate stable primary keys.
3. Choose log-based CDC when supported.
4. Plan initial snapshot and handoff to log position.
5. Define insert/update/delete semantics.
6. Handle schema changes explicitly.
7. Protect sensitive columns.
8. Monitor source-log retention, lag, and connector offsets.
9. Test restart and resnapshot scenarios.

## Decision points
Publish domain events from applications when business semantics matter; use CDC for integration/state replication when database changes are sufficient.

## Common failure patterns
Polling timestamps; no primary key; replication-slot disk growth; treating row changes as business facts; unsafe resnapshot duplicates.

## Verification
Compare source and sink counts/state, test updates/deletes/restarts, and prove no gap at snapshot transition.

## Expected output
CDC topology, offset/snapshot strategy, schema policy, and operational alerts.

## Stop conditions
Stop if database privileges, log retention, or stable keys cannot support safe capture.