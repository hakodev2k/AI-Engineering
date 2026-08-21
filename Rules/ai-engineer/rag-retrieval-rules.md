# RAG Retrieval Rules
## Purpose
Ensure retrieval-augmented generation uses relevant, authorized, and traceable evidence.
## Scope
Chunking, indexing, embeddings, retrieval, filtering, reranking, and source attribution.
## MUST
- Enforce document-level authorization before retrieved content reaches the model.
- Evaluate retrieval quality separately from generation quality.
- Preserve source identifiers so material claims can be traced to supporting content.
- Define freshness and re-indexing behavior for mutable sources.
## MUST NOT
- Treat top-k similarity alone as proof that retrieved content is correct or sufficient.
- Bypass tenant or user access boundaries during retrieval.
## SHOULD
- Tune chunking, filters, hybrid search, and reranking using representative queries.
## Exceptions
Exceptions require documented constraints, risk, and compensating verification.
## Verification
Use retrieval benchmarks, authorization tests, stale-index tests, source-trace checks, and production metrics.