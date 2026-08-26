# Cache-Aside and Write Strategy

## Purpose
Control ordering and failure semantics for reads and writes involving caches.

## Scope
Cache-aside, read-through, write-through, write-behind, and refresh-ahead patterns.

## MUST
- The chosen strategy MUST document authoritative write ordering, cache update ordering, retry behavior, and partial-failure handling.
- Write-behind MUST define durability, replay, deduplication, and data-loss bounds.
- Cache-aside implementations MUST prevent stale refill races after authoritative mutations.
- Retries MUST preserve idempotency where duplicate effects are possible.

## MUST NOT
- Write-behind MUST NOT be used for data whose accepted durability requirement exceeds the cache pipeline guarantee.
- Cache update success MUST NOT mask authoritative-store write failure.
- Pattern names MUST NOT substitute for explicit failure semantics.

## SHOULD
- Prefer strategies whose failure behavior is simplest for the required consistency model.
- Test races between reads, writes, invalidation, and expiry.

## Exceptions
Require documented durability and consistency trade-offs, alternatives, evidence, and approval for material risk.

## Verification
Use integration, race, restart, retry, and fault-injection tests plus production traces and reconciliation metrics.