# Graph Ingestion Pipelines

## Purpose
Build reliable ingestion pipelines that transform source data into graph facts while preserving identity, provenance, validation, and replayability.

## When to use
Use for batch or streaming ingestion into RDF stores, property graphs, or hybrid knowledge platforms.

## Inputs
Source contracts, schemas, ontology/graph model, mapping rules, change feeds, quality requirements, and operational SLOs.

## Preconditions
Define source-of-truth ownership, canonical identifiers, retry semantics, and whether historical replay is required.

## Context to inspect
Source freshness, CDC semantics, duplicate delivery, ordering guarantees, schema drift, deletion signals, and destination transaction limits.

## Core knowledge
Graph ingestion must be idempotent where retries are possible. Mapping should separate extraction from semantic transformation. Provenance and source timestamps are first-class when facts can conflict or evolve.

## Procedure
1. Profile source data and contracts.
2. Define source-to-graph mappings explicitly.
3. Normalize identifiers and datatypes.
4. Resolve or defer entity identity decisions.
5. Validate facts before mutation.
6. Batch writes according to destination limits.
7. Make retries idempotent using stable keys or checkpoints.
8. Handle deletes, tombstones, and late events explicitly.
9. Attach provenance and source timestamps.
10. Quarantine invalid records with diagnostics.
11. Support deterministic replay from checkpoints.
12. Monitor throughput, lag, rejection, and duplicate rates.

## Decision points
Use batch for bounded snapshots and cost-efficient rebuilds; streaming for freshness-critical changes. Prefer upserts when identity is stable; avoid blind replacement when multiple sources contribute facts.

## Common failure patterns
Duplicate nodes on retry; lost deletes; unordered updates overwriting newer facts; schema drift silently changing semantics; and no replay path.

## Verification
Replay a known slice, inject duplicates and late events, compare counts and identities, validate quarantines, and confirm graph invariants after repeated execution.

## Expected output
An idempotent ingestion pipeline, mappings, checkpoints, quality gates, provenance, and operational metrics.

## Stop conditions
Stop when source identity or deletion semantics are ambiguous enough to risk irreversible corruption.