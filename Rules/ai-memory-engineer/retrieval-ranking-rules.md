# Retrieval and Ranking Rules

## Purpose
Return relevant memory without allowing stale, weak, or unrelated records to dominate agent decisions.

## Scope
Candidate generation, filtering, ranking, reranking, thresholds, and retrieval context assembly.

## MUST
- Retrieval MUST apply authorization and tenant boundaries before ranking.
- Ranking MUST consider relevance plus memory authority, recency, and validity where applicable.
- Retrieval thresholds MUST be calibrated against representative tasks rather than chosen arbitrarily.
- Returned memories MUST preserve provenance metadata needed for downstream reasoning or audit.

## MUST NOT
- MUST NOT rank semantically similar but invalid or revoked memories as active evidence.
- MUST NOT allow retrieval expansion to bypass privacy or access policy.
- MUST NOT claim retrieval quality improvement without measured evaluation.

## SHOULD
- Prefer diverse relevant evidence when redundant memories would crowd out useful context.
- Keep retrieval behavior deterministic enough for reproducible debugging where practical.

## Exceptions
Exceptions require measured benefit, bounded risk, and documented validation.

## Verification
Review retrieval tests, ranking metrics, authorization tests, benchmark datasets, and sampled traces.