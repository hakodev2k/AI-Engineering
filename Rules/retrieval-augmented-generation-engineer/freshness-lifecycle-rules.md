# Freshness and Lifecycle Rules

## Purpose
Keep retrieved knowledge aligned with authoritative source lifecycle, freshness expectations, and deletion obligations.

## Scope
Applies to source updates, reindexing, TTLs, tombstones, document replacement, expiration, and corpus freshness.

## MUST
- Every source class MUST define expected freshness and acceptable indexing lag where freshness affects correctness.
- Updates, deletions, and permission changes MUST have deterministic propagation behavior into derived indexes.
- Superseded content MUST be distinguishable from current content during retrieval.
- Freshness metadata MUST be preserved when recency affects ranking or answer validity.
- Reindex and backfill jobs MUST be observable, restartable, and safe against duplicate logical content.
- Retention and deletion obligations MUST propagate to caches and derived retrieval stores.

## MUST NOT
- Expired or revoked content MUST NOT remain retrievable indefinitely because an index rebuild is inconvenient.
- Timestamps MUST NOT be fabricated when the source does not provide reliable freshness information.
- Freshness boosts MUST NOT override authorization or source trust requirements.

## SHOULD
- Use incremental updates when they meet correctness guarantees.
- Track freshness SLOs for critical corpora.
- Prefer tombstone or version mechanisms that support safe asynchronous propagation.

## Exceptions
Exceptions require documented source limitations, impact window, compensating controls, and approval when stale content can create legal, security, or material business risk.

## Verification
Inspect update/delete tests, index lag metrics, retention jobs, stale-content regression queries, permission-revocation propagation, and lifecycle dashboards.