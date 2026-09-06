# Hybrid Search Rules

## Purpose
Combine lexical and semantic retrieval without creating opaque ranking behavior.

## Scope
BM25, dense retrieval, fusion, score normalization, weighting, and candidate merging.

## MUST
- Hybrid retrieval MUST define how lexical and semantic candidates are combined.
- Score normalization and fusion logic MUST be deterministic and versioned.
- Weight changes MUST be evaluated on representative query classes.
- Candidate deduplication MUST preserve the highest-quality provenance and metadata.
- Hybrid search MUST remain compatible with authorization filters.

## MUST NOT
- MUST NOT compare raw scores from incompatible retrieval systems without normalization or documented fusion logic.
- MUST NOT hide one retrieval path's failures behind aggregate metrics.
- MUST NOT increase candidate volume without considering reranking latency and cost.

## SHOULD
- Evaluate lexical-only, dense-only, and hybrid baselines.
- Tune by query segment when evidence supports segmentation.

## Exceptions
Single-mode retrieval is acceptable when measured quality and operational simplicity justify it.

## Verification
Inspect fusion code, offline evaluations, segment metrics, candidate traces, and latency profiles.