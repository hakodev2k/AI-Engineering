# Embedding and Vector Search Engineering

## Purpose
Build and tune semantic retrieval using embeddings without treating vector similarity as a black box.

## When to use
Use for semantic search, retrieval, recommendation-like matching, clustering, duplicate detection, or RAG candidate generation.

## Inputs
Corpus, query set, relevance labels, embedding model options, vector database/search engine, metadata, latency and cost constraints.

## Preconditions
Define what “similar” means for the business task and collect representative query-document relevance examples.

## Context to inspect
Language/domain distribution, document size, exact identifiers, metadata filters, index configuration, distance metric, top-k, update frequency.

## Core knowledge
Embedding models encode semantic relationships imperfectly and are model/domain dependent. Search quality depends on representation, chunking, normalization, distance metric, ANN index parameters, filtering, and reranking. Exact text and structured metadata often complement vectors.

## Procedure
1. Define relevance criteria and labeled evaluation queries.
2. Compare candidate embedding models on the actual domain.
3. Normalize source units and choose stable identifiers.
4. Generate embeddings with version metadata.
5. Configure distance metric and ANN index according to engine/model guidance.
6. Tune top-k and metadata filters using recall and latency measurements.
7. Add lexical retrieval or reranking when vectors miss identifiers or fine distinctions.
8. Plan re-embedding and index migration for model changes.
9. Monitor index freshness, failed embeddings, latency, and retrieval drift.
10. Re-evaluate after corpus or query distribution changes.

## Decision points
Prefer exact/lexical search for codes, names, and literal phrases. Prefer vectors for semantic intent. Use hybrid search when both matter. Increase candidate count only when recall improves enough to justify latency/cost.

## Common failure patterns
No labeled relevance set, comparing raw similarity scores across embedding models, mixing embedding versions, ignoring metadata filters, re-embedding without migration planning, and assuming nearest means relevant.

## Verification
Measure recall@k, precision/relevance, latency, index freshness, and domain-specific failure categories; manually inspect difficult queries.

## Expected output
A versioned embedding/search design with tuned parameters, evaluation evidence, and migration strategy.

## Stop conditions
Stop when relevance is undefined, source units cannot be identified consistently, or privacy policy prevents sending content to the embedding provider.