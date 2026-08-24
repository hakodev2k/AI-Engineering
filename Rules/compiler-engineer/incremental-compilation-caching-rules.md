# Incremental Compilation and Caching Rules

## Purpose
Accelerate builds without returning stale or semantically incompatible results.

## Scope
Dependency graphs, incremental invalidation, module caches, artifact caches, and remote caches.

## MUST
- Cache identity MUST include all semantic inputs, compiler versioning inputs, target configuration, and relevant environment contracts.
- Dependency invalidation MUST be conservative when impact cannot be proven absent.
- Cache corruption MUST fail safely and permit clean recomputation.
- Incremental and clean builds MUST be semantically equivalent.

## MUST NOT
- MUST NOT reuse artifacts after an untracked semantic dependency changes.
- MUST NOT treat timestamps alone as proof of content identity when correctness requires stronger identity.
- MUST NOT allow cache hits to bypass required security or compatibility validation.

## SHOULD
- Cache formats SHOULD be versioned.
- Invalidation decisions SHOULD be observable enough to diagnose stale-build defects.

## Exceptions
Aggressive caching requires measured benefit, bounded risk, and explicit correctness tests.

## Verification
Compare clean versus incremental builds, mutate dependency classes, corrupt caches intentionally, and validate keys and invalidation traces.