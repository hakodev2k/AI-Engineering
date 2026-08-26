# Embedding Model Migration

## Purpose
Migrate embedding models without corrupting similarity semantics or causing uncontrolled retrieval regressions.

## When to use
Use when upgrading providers/models, dimensions, preprocessing, or embedding objectives.

## Inputs
Old/new models, corpora, query set, quality targets, schema/index constraints, capacity, and rollback window.

## Context to inspect
Inspect model versions, vector dimensions/metrics, index compatibility, ingestion throughput, storage headroom, query routing, caches, and evaluation baselines.

## Core knowledge
Embeddings from different model spaces are generally not comparable. Safe migration usually requires dual storage/indexing, backfill, shadow evaluation, controlled cutover, and rollback.

## Procedure
1. Establish old-model quality and latency baseline.
2. Validate new metric, dimension, preprocessing, and licensing/privacy constraints.
3. Build a new versioned vector field/index/collection rather than mixing spaces.
4. Backfill from authoritative source with checkpoints.
5. Dual-write new source changes during backfill.
6. Reconcile completeness and source revisions.
7. Shadow or canary queries against the new index.
8. Compare quality, latency, cost, and failure rate by query segment.
9. Gradually shift reads with rollback capability.
10. Retire old vectors only after an agreed observation window.

## Decision points
Use in-place replacement only if no mixed-space window can occur and rollback is unnecessary; otherwise version side-by-side. Re-embed from source rather than transforming old vectors unless a validated mapping exists.

## Common failure patterns
Mixing dimensions/models; deleting old vectors too early; no dual-write during long backfill; comparing only offline averages; ignoring new tokenization/preprocessing; insufficient storage headroom.

## Verification
Confirm 100% intended coverage, no mixed-version queries, held-out relevance improvement/non-regression, production SLOs, and tested rollback.

## Expected output
A phased migration with version isolation, completeness evidence, cutover gates, and retirement criteria.

## Stop conditions
Stop if source content cannot be reproduced, capacity is insufficient for coexistence, or new model governance/security approval is missing.