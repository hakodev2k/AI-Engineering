# Schema Evolution

## Purpose
Evolve persisted and transmitted schemas safely while multiple application versions and delayed data coexist.

## When to use
Use for database schemas, event schemas, serialized messages, caches, and long-lived stored documents.

## Inputs
Existing schema, readers/writers, retention period, deployment sequence, migration capability, and compatibility requirements.

## Context to inspect
Inspect old application versions, replayable events, consumers, migration jobs, indexes, defaults, nullability, and rollback expectations.

## Core knowledge
Distributed deployments create periods where old and new readers/writers coexist. Expand-and-contract migration separates compatible introduction from later cleanup.

## Procedure
1. Inventory active readers and writers.
2. Define backward and forward compatibility needs.
3. Introduce additive schema changes first.
4. Deploy code that tolerates both old and new forms.
5. Backfill or transform data in bounded, restartable batches when required.
6. Switch authoritative writes/read paths only after compatibility is proven.
7. Observe old-format usage.
8. Remove obsolete fields/indexes only after all readers/writers migrate.
9. Test rollback and replay of historical data.
10. Document irreversible steps.

## Decision points
Use lazy migration when data can safely convert on access; use controlled backfill when queries or invariants require complete transformation before cutover.

## Common failure patterns
Rename-as-drop-and-add, adding non-null fields without safe defaults, giant blocking migrations, and forgetting old events can be replayed.

## Verification
Test mixed-version deployment, rollback, historical replay, and migration restartability. Verify data counts/invariants after backfill.

## Expected output
A phased schema migration with compatibility windows, verification, and cleanup criteria.

## Stop conditions
Escalate before destructive or irreversible migration when rollback and backup/recovery evidence are insufficient.