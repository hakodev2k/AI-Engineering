# Zero-Downtime Index Migrations

## Purpose
Move search traffic between incompatible index, analyzer, embedding, or schema versions without losing data, corrupting relevance, or requiring service downtime.

## When to use
Use when analyzer changes require reindexing, mappings change incompatibly, embeddings/models are upgraded, shard topology changes, or major relevance migrations are introduced.

## Inputs
Current and target schema, source-of-truth data, ingestion mechanism, aliases/routing, replay capability, validation queries, rollback requirements.

## Context to inspect
Current index aliases, write path, change-data capture, backfill tooling, document identity, delete semantics, ingestion lag, index health, and deployment dependencies.

## Core knowledge
Safe migration separates build, catch-up, validation, promotion, and cleanup. New indexes must receive all writes that occurred during backfill. Alias or routing swaps should be atomic where supported, and old indexes should remain available until rollback confidence expires.

## Procedure
1. Freeze and version the target mapping/analyzers/models.
2. Create the target index without changing production routing.
3. Backfill from an authoritative source or replayable log.
4. Capture concurrent creates, updates, and deletes during backfill.
5. Reconcile document counts and sampled content.
6. Run relevance and performance regression suites against the target.
7. Confirm target ingestion lag is within promotion threshold.
8. Switch read routing atomically or through controlled canary traffic.
9. Monitor errors, latency, result deltas, and freshness.
10. Keep old index intact through the rollback window, then retire it deliberately.

## Decision points
Use dual-write when write semantics are reliable and simple; change-data capture or replay when stronger recovery and auditability are required. Canary read traffic before full alias swap when changes are high risk.

## Common failure patterns
Backfill without delete capture, changing schema during migration, deleting old index immediately, comparing only document counts, unversioned embeddings, and promotion while target ingestion is behind.

## Verification
Verify counts, sampled hashes/fields, delete propagation, query regressions, latency, freshness, and rollback by routing a controlled test back to the prior version.

## Expected output
Migration runbook, versioned target, reconciliation evidence, relevance/performance results, promotion criteria, monitoring, and rollback window.

## Stop conditions
Stop when source-of-truth replay is incomplete, concurrent writes cannot be reconciled, validation shows unexplained regressions, or rollback cannot be executed safely.