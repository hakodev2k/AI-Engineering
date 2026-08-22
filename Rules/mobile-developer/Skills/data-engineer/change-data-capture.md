# Change Data Capture

## Purpose
Capture database changes with correct ordering, lifecycle, replay, and downstream application semantics.

## When to use
Use when downstream systems need inserts, updates, and deletes more efficiently or quickly than periodic full extraction.

## Inputs
Source database capabilities, transaction log behavior, table keys, schema evolution rules, retention, consumers, and latency targets.

## Context to inspect
Inspect CDC mechanism, transaction boundaries, log retention, snapshots, key changes, DDL handling, connector offsets, and downstream sink semantics.

## Core knowledge
CDC represents changes, not final truth by itself. Initial snapshots and log streams must meet without gaps. Consumers need stable keys, ordering assumptions, delete handling, deduplication, and schema compatibility.

## Procedure
1. Define tables and changes in scope.
2. Verify stable identifiers and source retention.
3. Plan initial snapshot and transition to continuous capture.
4. Persist connector offsets durably.
5. Preserve operation type and source ordering metadata.
6. Define update and delete application semantics.
7. Handle DDL and incompatible schema changes deliberately.
8. Monitor lag and source-log retention headroom.
9. Test connector restart and replay.
10. Document resnapshot recovery.

## Decision points
Use log-based CDC when available and operationally supported; polling may be simpler for low-volume sources but often misses deletes or rapid changes. Apply changes directly only when sinks can enforce idempotency and ordering constraints.

## Common failure patterns
Snapshot/log gaps, insufficient log retention, changing primary keys, treating update events as complete rows without evidence, and losing tombstones.

## Verification
Compare a source snapshot with reconstructed downstream state, restart connectors, replay duplicate changes, and verify deletes and schema transitions.

## Expected output
A monitored CDC flow with documented snapshot, offset, ordering, schema, and recovery behavior.

## Stop conditions
Escalate if source log retention cannot cover outages, keys are unstable, or connector privileges exceed approved security boundaries.