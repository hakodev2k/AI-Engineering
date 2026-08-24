# Vector Retrieval

## Purpose
Design dense-vector candidate retrieval that improves semantic recall while controlling embedding quality, index cost, latency, and false semantic matches.

## When to use
Use when lexical retrieval misses paraphrases, conceptual similarity, natural-language questions, or multilingual semantic relationships.

## Inputs
Corpus, query samples, relevance judgments, embedding model, vector dimensions, ANN engine capabilities, latency and memory budgets.

## Context to inspect
Embedding generation pipeline, chunk/document granularity, normalization, vector index parameters, filtering support, refresh lag, and current recall failures.

## Core knowledge
Vector similarity is only a proxy for relevance. Embedding model, representation granularity, ANN parameters, filtering, and domain shift jointly determine quality. Approximate retrieval trades exact recall for speed and memory.

## Procedure
1. Define semantic failure cases lexical search does not solve.
2. Select document representation granularity and metadata boundaries.
3. Benchmark candidate embedding models on judged pairs.
4. Normalize vectors when required by the similarity metric.
5. Build an ANN index with representative corpus scale.
6. Tune search breadth against recall and latency.
7. Apply hard filters separately from semantic similarity unless engine behavior is validated.
8. Inspect nearest-neighbor failures for topical but non-relevant matches.
9. Compare vector recall to lexical and hybrid baselines.
10. Version embeddings and indexes together.

## Decision points
Use document-level vectors for coarse retrieval and chunk-level vectors for passage relevance. Choose cosine, dot product, or Euclidean distance according to model training assumptions.

## Common failure patterns
Changing embedding model without reindexing, mixing vector versions, oversized chunks, semantic retrieval for identifiers, weak metadata filtering, and evaluating only similarity examples.

## Verification
Measure Recall@K, latency percentiles, index memory, filtering correctness, and judged semantic query segments against baseline.

## Expected output
Embedding/index design, ANN parameters, versioning scheme, quality/latency evidence, and fallback behavior.

## Stop conditions
Stop when embedding provenance is unknown, evaluation data cannot demonstrate semantic value, or vector cost violates serving constraints.