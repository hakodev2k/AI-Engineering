# RAG Pipeline Observability

## Purpose
Instrument retrieval-augmented generation so retrieval failures can be distinguished from generation failures.

## When to use
Use for RAG production systems, relevance regressions, stale knowledge, retrieval latency, or citation complaints.

## Inputs
Query pipeline, indexes, embeddings, retrievers, rerankers, filters, generated answers, evaluation labels, and traces.

## Context to inspect
Inspect query rewriting, embedding model/version, index version, filters, top-k, reranking, chunk metadata, context assembly, and citation mapping.

## Core knowledge
RAG quality depends on corpus freshness, retrieval recall, ranking, context selection, and model grounding. Production telemetry should capture identifiers and scores safely without dumping proprietary document text.

## Procedure
1. Trace query rewrite, embedding, retrieval, reranking, context assembly, and generation as distinct stages.
2. Record index and embedding versions, top-k, filters, result counts, score distributions, and latency.
3. Track empty retrieval, filtered-to-zero, reranker failure, context truncation, and citation mismatch rates.
4. Link production traces to offline evaluation examples using privacy-safe identifiers.
5. Monitor corpus/index freshness and ingestion lag.
6. Segment quality proxies by query class and index version.
7. Investigate regressions by comparing retrieval evidence before generation behavior.
8. Add canary checks for known-answer retrieval paths.

## Decision points
Store document IDs rather than content when possible. Use offline labeled evaluation for relevance claims; use production metrics for drift and operational symptoms.

## Common failure patterns
Only measuring final answer quality, missing index versions, logging full documents, treating similarity score as universal quality, and ignoring ingestion freshness.

## Verification
Run a known evaluation set and prove traces identify retrieved documents, rankings, versions, truncation, and final citations consistently.

## Expected output
Stage-level telemetry, retrieval dashboards, freshness monitors, and diagnostic workflows.

## Stop conditions
Stop if document identifiers themselves are sensitive or evaluation ground truth is insufficient for a quality conclusion.