# Cache Invalidation

## Purpose
Design safe, fast invalidation for cached content without making purge the normal substitute for sound cache semantics.

## When to use
Use for mutable cached content, emergency corrections, releases, or stale-content incidents.

## Inputs
Content identifiers, cache-key rules, purge APIs, propagation guarantees, update workflow, acceptable stale duration.

## Context to inspect
Tag/surrogate-key support, URL patterns, wildcard limits, multi-layer caches, deployment automation, purge quotas.

## Core knowledge
Invalidation can target URLs, prefixes, tags, or entire zones. Broad purges increase origin load and risk thundering herds; versioned URLs avoid most invalidation needs.

## Procedure
1. Map content updates to cache objects.
2. Prefer immutable versioned assets where possible.
3. Choose the narrowest reliable invalidation primitive.
4. Ensure all cache tiers receive invalidation.
5. Make purge calls authenticated, auditable, and idempotent.
6. Rate-limit bulk invalidations.
7. Plan origin capacity for post-purge misses.
8. Test propagation time across representative POPs.
9. Define emergency broad-purge approval and rollback.

## Decision points
Use tag purge for logical groups, URL purge for precise objects, versioning for release assets, and full purge only for exceptional correctness events.

## Common failure patterns
Purging only one tier, wildcard overreach, purge storms, missing variants, unaudited credentials, and invalidating before new origin content is ready.

## Verification
Confirm targeted objects miss or revalidate after purge while unrelated objects remain cached; measure propagation and origin-load impact.

## Expected output
An invalidation strategy, automation contract, safeguards, observability, and tested recovery procedure.

## Stop conditions
Stop before a broad production purge when scope is uncertain, origin capacity is inadequate, or authorization is missing.