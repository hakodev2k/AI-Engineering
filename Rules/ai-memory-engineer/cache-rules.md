# Memory Cache Rules

## Purpose
Use caching to improve latency without violating freshness, isolation, deletion, or authorization guarantees.

## Scope
Query caches, embedding caches, retrieval-result caches, local caches, and invalidation.

## MUST
- Cache keys MUST include every identity, tenant, policy, and version dimension required to prevent cross-scope reuse.
- Cache TTLs MUST reflect memory validity and revocation requirements.
- Deletion or permission revocation MUST invalidate affected cached entries within the defined objective.
- Cache fallback behavior MUST preserve authorization and semantic correctness.

## MUST NOT
- MUST NOT share personalized memory results across users through incomplete cache keys.
- MUST NOT use stale cached memory when the use case requires immediate revocation.
- MUST NOT add caching without measurable latency or cost benefit.

## SHOULD
- Track hit rate, stale-hit rate, invalidation failures, and latency impact.
- Prefer bounded caches with explicit eviction behavior.

## Exceptions
Exceptions require documented scope, staleness tolerance, safeguards, and approval.

## Verification
Inspect cache-key construction, isolation tests, invalidation tests, TTL configuration, and performance metrics.