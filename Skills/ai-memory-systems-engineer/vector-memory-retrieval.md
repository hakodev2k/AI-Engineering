# Vector Memory Retrieval

## Purpose
Design semantic retrieval for memories using embeddings without sacrificing scope isolation, recency, precision, or explainability.

## When to use
Use when exact-key lookup cannot capture semantic relevance across conversational memories, notes, episodes, or summaries.

## Inputs
Memory records, embedding model, query patterns, metadata filters, latency targets, relevance labels.

## Preconditions
Identity and authorization filters must be enforceable before results are returned.

## Context to inspect
Embedding dimensions, index type, similarity metric, metadata schema, top-k settings, reranking, and observed retrieval failures.

## Core knowledge
Vector similarity is only one relevance signal. Strong memory retrieval combines semantic similarity with scope, type, temporal validity, recency, confidence, and task intent.

## Procedure
1. Define retrieval intents and labeled examples.
2. Select text or structured representation to embed.
3. Enforce scope filters.
4. Choose index and similarity metric.
5. Tune candidate count separately from final result count.
6. Add metadata and temporal filtering.
7. Rerank with task-aware signals when needed.
8. Define minimum relevance thresholds.
9. Log retrieval rationale and scores.
10. Evaluate precision, recall, latency, and stale-result rate.

## Decision points
Use approximate nearest neighbor search for scale; use exact search for small corpora or evaluation baselines. Add reranking only when quality gains justify latency and cost.

## Common failure patterns
Global search then authorization filtering; embedding stale summaries; fixed top-k across tasks; no relevance floor; assuming cosine similarity equals usefulness.

## Verification
Evaluate against labeled retrieval sets and production traces segmented by memory type and age.

## Expected output
A measured semantic retrieval configuration and evaluation report.

## Stop conditions
Stop when scope filtering cannot be guaranteed or relevance cannot be evaluated.