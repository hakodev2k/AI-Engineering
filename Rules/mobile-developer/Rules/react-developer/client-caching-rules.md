# Client Caching Rules

## Purpose
Keep frontend caching correct, bounded, and aligned with data freshness requirements.

## Scope
Applies to query caches, browser caches, local persistence, memoized data, and prefetching.

## MUST
- Cached data MUST have an explicit freshness/invalidation strategy.
- Cache keys MUST include every input that materially changes the result.
- Mutation flows MUST define how affected cached data becomes consistent again.
- Sensitive cached data MUST follow the same privacy and authorization expectations as uncached data.
- Persistent caches MUST tolerate stale schema/data across application versions when persistence spans deployments.

## MUST NOT
- MUST NOT use caching to mask unresolved correctness or backend latency problems without evidence.
- MUST NOT cache authorization decisions beyond their valid security lifetime.
- MUST NOT assume cache invalidation happens automatically across tabs, users, or deployments.

## SHOULD
- Prefer bounded cache lifetimes and documented invalidation triggers.
- Prefer server-state libraries when they provide reliable lifecycle and reconciliation behavior.

## Exceptions
Document the consistency model, stale-data risk, business tolerance, and verification evidence.

## Verification
Use integration tests, cache-key inspection, stale-data tests, mutation tests, cross-session checks, and production telemetry where available.