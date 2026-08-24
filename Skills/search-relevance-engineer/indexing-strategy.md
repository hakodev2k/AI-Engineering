# Indexing Strategy

## Purpose
Design index schemas, denormalization, sharding, replication, refresh behavior, and lifecycle so search remains relevant, fast, and operable as data changes.

## When to use
Use for new search domains, schema redesigns, large corpus growth, freshness problems, or index migration planning.

## Inputs
Source schema, document volume, update frequency, query patterns, field usage, latency and freshness targets, storage constraints.

## Context to inspect
Current mappings, shard sizes, refresh intervals, replicas, aliases, ingestion lag, field cardinality, index growth, and historical migrations.

## Core knowledge
Search indexes optimize reads through denormalized representations. Schema choices affect relevance, storage, update cost, and query latency. Index lifecycle must permit safe reindex, validation, promotion, and rollback.

## Procedure
1. Identify searchable, filterable, sortable, facetable, stored, and ranking fields.
2. Define canonical document identity and update semantics.
3. Denormalize only data required for search behavior.
4. Select field types and analyzers intentionally.
5. Estimate document and index growth.
6. Size shards using workload evidence rather than fixed conventions.
7. Define refresh and replication according to freshness and durability needs.
8. Version mappings and index names.
9. Plan dual-write or replay strategy for migrations.
10. Validate a representative corpus before alias promotion.

## Decision points
Choose fewer larger shards until parallelism or operational limits justify more. Prefer reindexing over in-place schema tricks when semantics materially change.

## Common failure patterns
Dynamic mapping explosions, oversharding, unbounded nested documents, indexing unused fields, mutable identifiers, and migrations without rollback aliases.

## Verification
Compare document counts, field distributions, ingestion lag, query latency, storage, and relevance between old and new indexes.

## Expected output
Versioned schema, indexing topology, sizing assumptions, freshness policy, migration procedure, and validation checklist.

## Stop conditions
Escalate when source data lacks stable identity, growth estimates are unavailable, or a destructive migration lacks a verified rollback path.