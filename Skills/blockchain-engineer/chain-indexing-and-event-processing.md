# Chain Indexing and Event Processing

## Purpose
Build reliable off-chain projections from blockchain logs and state while handling replay, reorgs, ordering, backfills, and schema evolution.

## When to use
Use for indexers, explorers, analytics, application databases, notifications, and any service deriving state from chain events.

## Inputs
Contract addresses, event schemas, start blocks, finality policy, storage model, backfill volume, query requirements.

## Preconditions
Source contracts and chain identities are known and event semantics are understood.

## Context to inspect
Event signatures, block/hash checkpoints, database uniqueness keys, consumer offsets, websocket/polling logic, historical migrations, and reorg handling.

## Core knowledge
Logs are ordered within a canonical chain view, but canonical history can change before finality. Indexing must be replayable and idempotent, with source block/hash provenance retained.

## Procedure
1. Define canonical event identities using chain, block, transaction, and log index.
2. Persist block number and block hash with projections.
3. Process events idempotently.
4. Choose a confirmation/finality threshold appropriate to the chain and use case.
5. Detect parent/hash discontinuities and roll back affected projections.
6. Reprocess from a known-safe checkpoint after reorgs.
7. Implement bounded historical backfills.
8. Version projection schemas and event decoders.
9. Catch up deterministically after subscription outages.
10. Reconcile indexed state against on-chain state for critical aggregates.

## Decision points
Use direct RPC indexing for bounded workloads; use specialized indexing infrastructure when scale, historical queries, or multi-chain complexity justifies it.

## Common failure patterns
Treating websocket delivery as durable, no deduplication, no block-hash provenance, ignoring removed logs, and making projections impossible to rebuild.

## Verification
Replay the same block range twice without duplicate effects; simulate a reorg and prove rollback/reprocessing; compare critical totals with on-chain state.

## Expected output
Replayable indexer, checkpoint/reorg design, schema/version policy, and reconciliation evidence.

## Stop conditions
Escalate when source events are insufficient to reconstruct required state and no trustworthy state-reading strategy exists.