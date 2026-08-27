# Change Data Capture

## Purpose
Design reliable change streams from distributed databases for integration, analytics, search, and downstream materialization.

## When to use
Use for CDC pipelines, event propagation, migrations, cache/index updates, or lag and duplicate-delivery incidents.

## Inputs
Source semantics, consumer requirements, ordering needs, retention, schema evolution, throughput, recovery objectives.

## Context to inspect
Database logs/change feeds, partitioning, checkpoints, consumer offsets, schemas, retention, transaction markers, and downstream idempotency.

## Core knowledge
CDC ordering is usually scoped, not global. Delivery may be at-least-once, and retention bounds recovery. Snapshot-to-stream handoff must avoid gaps. Schema changes are part of the data contract.

## Procedure
1. Define consumers and required semantics.
2. Identify ordering scope and transaction visibility.
3. Establish stable event identity.
4. Design snapshot/bootstrap plus stream handoff.
5. Persist checkpoints durably.
6. Make downstream application idempotent.
7. Define schema evolution rules.
8. Monitor lag and retention margin.
9. Test duplicates, restarts, repartitioning, and delayed consumers.
10. Provide replay procedures.

## Decision points
Use log-native CDC when low-impact faithful capture is available; use application outbox when business-event semantics must be controlled explicitly.

## Common failure patterns
Assuming exactly-once end-to-end, no stable event IDs, checkpointing before effects commit, snapshot/stream gaps, and retention shorter than outage recovery.

## Verification
Rebuild a consumer from snapshot and stream, inject restarts and duplicates, and compare final state with source invariants.

## Expected output
A CDC contract, checkpoint strategy, schema policy, monitoring, and replay-tested consumer path.

## Stop conditions
Escalate when source retention cannot satisfy recovery objectives or ordering requirements exceed source guarantees.