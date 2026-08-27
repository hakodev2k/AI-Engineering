# Retrieval and Grounding Rules

## Purpose
Ensure retrieval-augmented NLP systems use relevant, authorized, and traceable evidence.

## Scope
Chunking, indexing, retrieval, reranking, citations, context assembly, freshness, and access control.

## MUST
- Retrieval evaluation MUST measure task-relevant recall and precision using representative queries.
- Retrieved content MUST respect source authorization and tenant/user boundaries before entering model context.
- Grounded answers MUST retain sufficient provenance to identify supporting source material.
- Index freshness expectations and update behavior MUST be explicit.

## MUST NOT
- MUST NOT treat retrieval presence as proof that a generated claim is supported.
- MUST NOT bypass document access controls through a shared vector index or cache.
- MUST NOT optimize latency by dropping authorization checks.

## SHOULD
- Chunking and reranking SHOULD be tuned with retrieval evidence rather than intuition alone.
- Systems SHOULD distinguish no-evidence from low-confidence evidence.

## Exceptions
Cross-boundary retrieval requires explicit authorization design, security review, and auditability.

## Verification
Test permission isolation, retrieval benchmarks, citation/source alignment, stale-index behavior, hard negatives, cache boundaries, and end-to-end grounded-answer evaluation.