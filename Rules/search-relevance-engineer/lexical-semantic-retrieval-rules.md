# Lexical and Semantic Retrieval Rules

## Purpose
Balance exact-match precision with semantic recall while preserving predictable search behavior.

## Scope
Applies to term-based retrieval, vector retrieval, embeddings, ANN indexes, and candidate generation.

## MUST
- Retrieval strategies MUST be evaluated separately for recall and precision before ranking-stage effects are considered.
- Exact identifiers, quoted text, and critical lexical constraints MUST have explicit preservation rules where applicable.
- Embedding model or vector-index changes MUST be versioned and regression-tested.
- Candidate-generation limits MUST be justified by measured recall and latency trade-offs.

## MUST NOT
- MUST NOT replace lexical retrieval with semantic retrieval solely because aggregate relevance improves if critical exact-match use cases regress.
- MUST NOT compare embeddings from incompatible model spaces as if they were directly interchangeable.
- MUST NOT hide retrieval failures behind later reranking metrics.

## SHOULD
- Use hybrid retrieval when distinct query classes benefit from complementary mechanisms.

## Exceptions
Require documented query classes, evidence, risk, and approval.

## Verification
Inspect recall@k, exact-match tests, vector versioning, ANN quality tests, and latency measurements.