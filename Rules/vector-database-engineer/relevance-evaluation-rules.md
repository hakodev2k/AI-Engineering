# Relevance Evaluation

## Purpose
Make retrieval-quality decisions evidence-based and resistant to benchmark gaming.

## Scope
Applies to ANN tuning, hybrid search, filters, reranking, embedding changes, and retrieval releases.

## MUST
- Material retrieval changes MUST be evaluated on a representative, versioned query/relevance dataset.
- Evaluation MUST include metrics appropriate to the task, such as recall@k, precision@k, MRR, NDCG, or task success.
- Baseline and candidate results MUST use comparable datasets, filters, hardware conditions where relevant, and measurement procedures.
- Critical query segments MUST be analyzed separately when aggregate metrics can hide regressions.
- Release criteria MUST define acceptable quality regression bounds before testing begins.

## MUST NOT
- MUST NOT approve retrieval changes from anecdotal examples alone.
- MUST NOT tune exclusively against the final holdout set.
- MUST NOT report only favorable metrics while omitting known material regressions.

## SHOULD
- Evaluation sets SHOULD include hard negatives, sparse metadata, rare intents, and realistic filters.
- Human judgments SHOULD use documented rubrics and agreement checks when subjective relevance is material.
- Offline evaluation SHOULD be complemented by guarded online evidence where feasible.

## Exceptions
Exceptions require documented evidence limitations, risk, alternative validation, and explicit approval for high-impact releases.

## Verification
Inspect evaluation datasets, metric definitions, baseline/candidate reports, segment analyses, CI gates, human-judgment records, and release criteria.