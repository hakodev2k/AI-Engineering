# Embedding Retrieval and ANN

## Purpose
Design, tune, and operate embedding-based nearest-neighbor retrieval for recommendation workloads.

## When to use
Use for semantic or learned retrieval over large catalogs. Avoid it when simple indexed rules meet quality and latency goals.

## Inputs
Embedding model, vector corpus, similarity definition, index options, recall target, memory budget, and serving SLO.

## Context to inspect
Vector normalization, dimensionality, index build process, update frequency, sharding, filters, hardware, and query distribution.

## Core knowledge
ANN trades recall for latency/memory. HNSW, IVF, PQ and related methods have different build, memory, update, and recall profiles. Offline vector similarity is useful only when aligned with downstream utility.

## Procedure
1. Validate embedding semantics and similarity metric.
2. Build an exact-search benchmark subset.
3. Compare index families under realistic corpus size.
4. Sweep search/build parameters against recall and latency.
5. Test metadata filtering and skewed queries.
6. Define incremental update and full rebuild strategy.
7. Instrument index age, recall proxies, latency, memory, and failures.
8. Load-test before production rollout.

## Decision points
Choose higher-memory graph indexes for low-latency/high-recall needs; compression when memory dominates; rebuild versus incremental updates according to freshness and index behavior.

## Common failure patterns
Wrong distance metric, unnormalized vectors, benchmark leakage, tiny synthetic corpora, stale embeddings, filter-induced recall collapse, and ignoring index build cost.

## Verification
Compare ANN to exact neighbors, validate production-like latency percentiles, measure memory and freshness, and test failover/rebuild.

## Expected output
An ANN configuration and operational plan justified by recall, latency, memory, and freshness evidence.

## Stop conditions
Stop when embedding quality is unvalidated, memory exceeds safe capacity, or required filtering cannot preserve correctness.