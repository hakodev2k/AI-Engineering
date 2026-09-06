# RAG Retrieval and Grounding Testing

## Purpose
Test retrieval-augmented generation end to end so retrieval quality, context assembly, citation behavior, and answer grounding are evaluated separately and together.

## When to use
Use for systems that answer from vector search, hybrid search, knowledge bases, document stores, or other retrieved context.

## Inputs
Corpus, chunking/index configuration, retrieval pipeline, prompts, representative queries, relevance judgments, answer criteria, and citation rules.

## Preconditions
The source corpus and expected knowledge boundary are known.

## Context to inspect
Inspect ingestion, chunking, metadata filters, embeddings, ranking, reranking, query rewriting, context limits, citation mapping, and model instructions.

## Core knowledge
RAG failures may originate in ingestion, retrieval, ranking, context construction, or generation. Answer quality alone cannot identify the faulty layer. Evaluate retrieval recall/precision and generation faithfulness independently.

## Procedure
1. Build query sets covering common, rare, ambiguous, multi-document, and no-answer cases.
2. Define relevant source passages for a labeled subset.
3. Measure retrieval hit rate, ranking quality, and filter correctness.
4. Test chunk boundaries and metadata isolation.
5. Inspect context truncation and conflicting sources.
6. Evaluate answer correctness and faithfulness to retrieved evidence.
7. Verify citations point to supporting source content.
8. Test behavior when evidence is absent or insufficient.
9. Add stale, duplicated, and contradictory-document cases.
10. Compare candidate retrieval changes against baseline.

## Decision points
Tune retrieval when evidence is missing; tune generation when evidence is present but misused. Prefer abstention when authoritative evidence is unavailable for high-stakes tasks.

## Common failure patterns
Testing only final answers, judging retrieval by top-1 only, trusting citations without checking support, leaking metadata across tenants, and forcing answers when retrieval fails.

## Verification
Confirm retrieval and generation metrics pass separately, citations support claims, and no-answer behavior is validated.

## Expected output
A layered RAG test report with retrieval, grounding, citation, and abstention results plus diagnosed failure ownership.

## Stop conditions
Stop when corpus provenance is unclear, tenant boundaries cannot be tested, or required relevance labels cannot be established.