# Ranking

## Purpose
Control ranking logic as a production decision system with explicit trade-offs.

## Scope
Scoring functions, features, boosts, business rules, learning-to-rank, and reranking.

## MUST
- Document the purpose and expected effect of material ranking features and boosts.
- Bound business rules so they cannot unintentionally dominate relevance.
- Evaluate ranking changes for quality, latency, stability, and segment regressions.
- Version deployable ranking configurations and retain rollback capability.

## MUST NOT
- Add unexplained magic weights directly to production ranking.
- Use unavailable-at-query-time or leakage-prone features in offline evaluation.
- allow personalized or commercial signals to violate documented safety or access constraints.

## SHOULD
- Prefer simple ranking logic until evidence justifies added complexity.
- Monitor feature distributions and score behavior after release.

## Exceptions
Exceptions require evidence, risk analysis, owner, expiry or review date, and rollback criteria.

## Verification
Review feature definitions, ranking diffs, offline evaluation, latency tests, online experiments, and production distributions.