# Chunking and Context Boundaries

## Purpose
Design chunk boundaries that preserve semantic coherence while supporting efficient retrieval, grounding, and citation.

## When to use
Use when indexing long documents, improving RAG recall, reducing fragmented answers, or adapting retrieval to new content types.

## Inputs
Normalized documents, content structure, query patterns, embedding model constraints, reranker behavior, context-window budget, and citation requirements.

## Context to inspect
Inspect document sections, paragraph lengths, tables, code, headings, query logs, current chunk statistics, retrieval misses, and model context limits.

## Core knowledge
Chunk size trades retrieval precision against contextual completeness. Fixed-token splitting is simple but can cut semantic units. Structure-aware and recursive chunking usually preserve meaning better. Overlap can recover boundary context but increases index size and duplicate evidence.

## Procedure
1. Characterize document types and typical user questions.
2. Identify natural semantic boundaries such as sections, paragraphs, procedures, rows, or code units.
3. Set initial size targets compatible with embedding and generation budgets.
4. Preserve parent document and section identity on every chunk.
5. Apply limited overlap only where boundary loss is likely.
6. Keep tables, lists, and code semantically intact when possible.
7. Add parent-child relationships for hierarchical retrieval when needed.
8. Evaluate recall and answer support across multiple chunking variants.
9. Inspect failure cases rather than optimizing only aggregate scores.
10. Version the chunking configuration and reindex deliberately.

## Decision points
Use smaller chunks for pinpoint factual lookup, larger chunks for procedural or explanatory questions, and parent-child retrieval when both precision and broad context are needed.

## Common failure patterns
Arbitrary token cuts, excessive overlap, chunks without headings, splitting tables row-by-row without headers, mixing unrelated sections, and changing chunking without evaluation.

## Verification
Measure retrieval recall, duplicate rate, average context utilization, citation accuracy, and answer quality on representative queries. Manually inspect difficult boundary cases.

## Expected output
A documented, versioned chunking policy with content-type rules, hierarchy, overlap strategy, and evaluation evidence.

## Stop conditions
Stop when source structure is too corrupted to infer safe boundaries or reindexing would invalidate production behavior without rollback capability.