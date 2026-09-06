# Embedding and Vector Index Design

## Purpose
Select and operate embedding and vector-index strategies that support high-quality semantic retrieval at acceptable cost, latency, and governance risk.

## When to use
Use when introducing semantic search, changing embedding models, tuning vector databases, or investigating retrieval quality and scale limits.

## Inputs
Corpus size, languages, query types, embedding candidates, metadata filters, latency targets, update rate, cost limits, and infrastructure constraints.

## Context to inspect
Inspect current index schema, embedding dimensions, distance metric, ANN parameters, filter support, model versions, index size, recall metrics, and migration mechanisms.

## Core knowledge
Embedding quality is task-dependent. Index parameters trade recall, latency, and memory. Model changes can create incompatible vector spaces and usually require controlled re-embedding. Metadata filtering can materially alter candidate quality and performance.

## Procedure
1. Define retrieval tasks and a labeled evaluation set.
2. Benchmark candidate embedding models on domain and language coverage.
3. Choose similarity metric consistent with the model and index implementation.
4. Estimate storage, memory, indexing throughput, and query cost.
5. Design vector records with stable chunk IDs, source versions, and filterable metadata.
6. Tune ANN parameters against recall and latency targets.
7. Test filtered and unfiltered retrieval separately.
8. Version embeddings and prevent mixed incompatible spaces.
9. Design rolling re-embedding and rollback before model migration.
10. Monitor drift, index lag, failures, latency, and retrieval quality.

## Decision points
Prefer smaller embeddings when quality is comparable and scale dominates cost. Use exact search for small corpora or evaluation baselines; use ANN for large production corpora. Separate indexes when policy or workload isolation requires it, not merely for organizational convenience.

## Common failure patterns
Choosing models from generic benchmarks only, mixing embedding versions, ignoring multilingual behavior, over-tuning ANN speed at the expense of recall, and re-embedding without rollback.

## Verification
Compare retrieval metrics against a lexical baseline, test migrations on shadow indexes, validate filters, and confirm index counts and source-version alignment.

## Expected output
A versioned embedding/index design with benchmarks, capacity assumptions, migration plan, and operational thresholds.

## Stop conditions
Stop when representative evaluation data is missing, model licensing or data residency is unresolved, or migration cannot preserve production rollback.