# Graph Embeddings and Hybrid Retrieval

## Purpose
Combine graph structure with vector representations to improve similarity, recommendation, and retrieval while retaining semantic and structural controls.

## When to use
Use when symbolic graph traversal alone has low recall, when semantic similarity is needed, or when graph-derived context can improve vector search.

## Inputs
Graph schema, embedding model, candidate entities, textual/structural features, retrieval objective, relevance labels, and latency constraints.

## Preconditions
Establish a baseline using lexical, vector, or graph retrieval independently and define evaluation metrics.

## Context to inspect
Embedding provenance, model version, graph freshness, high-degree bias, vector index settings, entity text, relationship types, and access-control boundaries.

## Core knowledge
Embeddings compress similarity but lose explicit semantics. Structural embeddings can encode graph topology; text embeddings encode descriptive content. Hybrid retrieval should use graph constraints and vector similarity as complementary signals, not interchangeable truth sources.

## Procedure
1. Define the retrieval or ranking objective.
2. Select which node/edge information may enter embeddings.
3. Prevent target leakage and unauthorized feature exposure.
4. Generate and version embeddings reproducibly.
5. Build vector candidates and graph-based candidates separately.
6. Choose fusion or reranking logic.
7. Add graph filters for type, provenance, permissions, or topology.
8. Evaluate recall, precision, ranking quality, and latency.
9. Analyze failures by entity type and degree.
10. Define refresh triggers for graph or model changes.
11. Monitor drift and stale embeddings.

## Decision points
Use vector-first retrieval for broad semantic recall; graph-first retrieval when relationships or permissions sharply constrain candidates. Rerank when quality gains justify added latency.

## Common failure patterns
Embedding stale nodes; leaking restricted facts into vectors; high-degree bias; no lexical or structural baseline; mixing incompatible model versions; and assuming cosine similarity means semantic equivalence.

## Verification
Compare against baselines on labeled queries, inspect sensitive cases, test stale-data behavior, measure end-to-end latency, and verify permission filters cannot be bypassed.

## Expected output
A versioned hybrid retrieval design, evaluation results, refresh policy, and operational safeguards.

## Stop conditions
Stop when evaluation labels are inadequate for a high-impact use case or embeddings would expose information outside authorization boundaries.