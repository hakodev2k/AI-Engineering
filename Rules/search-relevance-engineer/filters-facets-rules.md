# Filters and Facets Rules

## Purpose
Ensure filtering and faceting preserve correctness, permissions, and understandable result counts.

## Scope
Applies to structured filters, facets, aggregations, query constraints, and result counts.

## MUST
- Hard filters MUST be applied consistently before or during ranking according to documented semantics.
- Authorization and tenant filters MUST never be optional relevance signals.
- Facet counts MUST correspond to the same filter semantics users experience.
- Filter changes MUST be regression-tested for inclusion, exclusion, null, and boundary cases.

## MUST NOT
- MUST NOT relax security, entitlement, legal, or explicit user filters to increase recall.
- MUST NOT silently reinterpret filter units, ranges, or enums.
- MUST NOT expose facet values derived from content the requester is not authorized to discover.

## SHOULD
- Keep filter behavior deterministic and independently testable from ranking.

## Exceptions
Require documented semantics, impact, evidence, and approval when protected constraints are involved.

## Verification
Inspect filter logic, authorization tests, facet-count tests, boundary cases, and production query traces.