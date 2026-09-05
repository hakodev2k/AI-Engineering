# Hybrid Ranking Rules

## Purpose
Combine lexical, semantic, learned, and rule-based ranking components without obscuring their interactions.

## Scope
Applies to score fusion, reranking, weighted ensembles, cascades, and fallback ranking.

## MUST
- Hybrid ranking MUST define how component scores are normalized, combined, and ordered.
- Component contribution changes MUST be evaluated with ablations or equivalent evidence.
- Fallback behavior MUST be deterministic when one component fails or is unavailable.
- Score fusion parameters MUST be versioned and reviewable.

## MUST NOT
- MUST NOT combine incomparable raw scores without normalization or justified calibration.
- MUST NOT add ranking stages whose marginal value is unknown while they materially increase latency or complexity.
- MUST NOT silently change fallback ranking behavior.

## SHOULD
- Keep enough diagnostic information to explain which component materially influenced a result.

## Exceptions
Require documented trade-off, affected traffic, evidence, and rollback.

## Verification
Review fusion logic, ablation results, config history, failure tests, and latency measurements.