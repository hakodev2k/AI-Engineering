# Pagination and Sorting

## Purpose
Provide stable, bounded result navigation without correctness or performance traps.

## Scope
Offsets, cursors, search-after, tie-breakers, deterministic sort, and deep pagination.

## MUST
- Define deterministic tie-breaking for paginated ordered results.
- Use cursor/search-after semantics for deep result traversal when offset cost or inconsistency is material.
- Bound maximum page size and traversal depth for interactive APIs.
- Define behavior when the underlying index changes between pages.

## MUST NOT
- promise stable pagination over a mutating corpus without a snapshot or documented consistency model.
- allow unbounded deep offset pagination on production search clusters.
- expose internal sort values that contain sensitive information.

## SHOULD
- Prefer opaque cursors for public contracts.
- Test duplicate and missing-result behavior across page boundaries.

## Exceptions
Exceptions require measured cost, consistency expectations, and API compatibility review.

## Verification
Run boundary tests, mutation-between-page tests, load tests for deep traversal, and contract review.