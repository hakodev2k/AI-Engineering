# RAG Architecture

## Purpose
Design retrieval-augmented generation systems that ground model outputs in authoritative, current, and permission-aware knowledge.

## When to use
Use when answers depend on private, dynamic, domain-specific, or source-citable information. Do not add RAG when the task is fully solvable from stable model knowledge or deterministic data access.

## Inputs
Knowledge sources, access controls, freshness needs, query patterns, quality targets, latency budget, and citation requirements.

## Context to inspect
Inspect source structure, document lifecycle, metadata, permissions, update frequency, existing search services, data quality, and representative queries.

## Core knowledge
RAG quality is constrained by ingestion, chunking, indexing, retrieval, reranking, context assembly, and generation. Retrieval recall and precision must be evaluated separately from answer quality.

## Procedure
1. Identify authoritative sources and ownership.
2. Define ingestion and update semantics.
3. Choose chunking based on document structure and retrieval intent.
4. Design metadata and permission filters.
5. Select lexical, vector, or hybrid retrieval based on query behavior.
6. Add reranking where recall is acceptable but ranking quality is weak.
7. Define context assembly and citation rules.
8. Add no-answer behavior for insufficient evidence.
9. Evaluate retrieval and generation independently.
10. Monitor freshness, index drift, latency, and permission correctness.

## Decision points
Prefer hybrid retrieval for mixed exact and semantic queries. Use direct database/API lookup for structured transactional facts. Add reranking only when measured quality gain justifies latency and cost.

## Common failure patterns
Embedding everything without source governance, leaking unauthorized chunks, excessive chunk overlap, evaluating only final answers, and forcing an answer when retrieval is weak.

## Verification
Measure retrieval recall, ranking quality, grounded-answer accuracy, citation correctness, latency, and access-control enforcement.

## Expected output
A RAG design covering ingestion, indexing, retrieval, permissions, generation, evaluation, and operations.

## Stop conditions
Stop when authoritative sources cannot be identified, permissions cannot be enforced, or freshness requirements cannot be met reliably.