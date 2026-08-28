# Embedding Rules

## Purpose
Govern embedding generation and use so semantic retrieval remains stable, measurable, and compatible.

## Scope
Applies to user, item, query, session, graph, multimodal, and learned embedding vectors.

## MUST
- Embedding models MUST be versioned together with dimensionality, normalization, tokenizer or encoder assumptions, and training data lineage.
- Producers and consumers MUST agree on embedding version before traffic is shifted.
- Embedding refresh cadence MUST match the volatility of represented entities and documented freshness needs.
- Similarity metrics and normalization behavior MUST be consistent between index construction and retrieval.
- Embedding changes MUST measure retrieval quality, coverage, latency, and index migration cost.

## MUST NOT
- MUST NOT mix incompatible embedding spaces in the same similarity computation.
- MUST NOT overwrite an active embedding index without a rollback-capable migration path.
- MUST NOT expose sensitive source content through debug tooling or logs when embeddings can be reverse-correlated.

## SHOULD
- Large migrations SHOULD use dual-read or shadow validation before cutover.
- Embedding drift SHOULD be monitored for important entity populations.

## Exceptions
Exceptions require compatibility evidence, bounded impact, and explicit migration ownership.

## Verification
Inspect model and index metadata, vector validation tests, migration plans, retrieval benchmarks, and freshness dashboards.