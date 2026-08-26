# Chunking Strategy

## Purpose
Partition source content into retrieval units that preserve meaning while fitting ranking and generation constraints.

## When to use
Use when designing or tuning indexing granularity.

## Inputs
Parsed documents, query examples, embedding limits, reranker limits, generation context budget, citation granularity.

## Context to inspect
Inspect document structure, answer span sizes, headings, tables, code, cross-section dependencies, and current retrieval misses.

## Core knowledge
Chunk size trades local specificity against contextual completeness. Fixed token windows are simple but often ignore semantic boundaries. Overlap can improve continuity but increases duplicates and index cost.

## Procedure
1. Analyze typical evidence span and document structure.
2. Choose semantic boundaries before arbitrary token limits.
3. Attach parent headings and provenance metadata.
4. Set maximum size compatible with embedding/ranking models.
5. Add overlap only where boundary loss is demonstrated.
6. Handle tables, code, and lists with format-aware policies.
7. Consider parent-child retrieval for long hierarchical documents.
8. Index competing strategies on a fixed evaluation set.
9. Compare recall, ranking, context duplication, and answer quality.
10. Version the strategy for reproducible reindexing.

## Decision points
Use smaller chunks for precise fact lookup; larger or parent-expanded chunks for explanatory context. Prefer structural chunking when documents have meaningful hierarchy.

## Common failure patterns
Universal chunk size; excessive overlap; severing tables; missing headings; changing chunk IDs on every reindex; evaluating only embedding similarity.

## Verification
Measure retrieval and grounded-answer performance, inspect boundary failures, and verify citation precision.

## Expected output
A versioned chunking policy justified by corpus and evaluation evidence.

## Stop conditions
Stop when parsed structure is unreliable enough that chunk boundaries cannot preserve meaning.