# Retrieval Ranking Rules

## Purpose
Ensure candidate ranking is evidence-driven, interpretable enough to debug, and aligned with answer quality rather than raw similarity alone.

## Scope
Applies to vector similarity, BM25 or lexical ranking, hybrid fusion, learned rerankers, metadata boosts, freshness adjustments, and post-retrieval ordering.

## MUST
- Ranking strategies MUST be evaluated on representative queries with relevance labels or defensible proxy judgments.
- Score semantics, normalization, fusion logic, and thresholding MUST be documented and reproducible.
- Rerankers MUST be versioned and evaluated independently from first-stage retrieval.
- Ranking changes MUST report effects on relevance, latency, cost, and failure modes.
- Business or freshness boosts MUST be explicit and MUST NOT override access control or source trust constraints.
- Ranking pipelines MUST expose enough intermediate evidence to debug why candidates were promoted or suppressed.

## MUST NOT
- Similarity scores MUST NOT be treated as calibrated confidence without validation.
- Hidden manual boosts MUST NOT be introduced without documentation and tests.
- A reranker MUST NOT consume restricted metadata that the requesting principal is not authorized to use.

## SHOULD
- Use offline relevance metrics plus end-to-end answer-quality evaluation.
- Prefer simple ranking logic until additional complexity demonstrates measurable benefit.
- Maintain regression query sets for critical intents and rare but high-risk cases.

## Exceptions
Exceptions require documented rationale, measurement limits, risk, and reviewer approval when ranking behavior can materially affect regulated, safety-critical, or externally visible outcomes.

## Verification
Review benchmark datasets, NDCG/MRR/Recall or equivalent metrics, score traces, latency profiles, access-control tests, and regression results before and after ranking changes.