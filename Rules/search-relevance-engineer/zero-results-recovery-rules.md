# Zero-Results Recovery Rules

## Purpose
Recover useful search experiences when strict retrieval returns no acceptable candidates.

## Scope
Applies to fallback retrieval, query relaxation, alternate suggestions, and empty-state behavior.

## MUST
- Zero-result recovery MUST define which constraints may be relaxed and in what order.
- Protected filters, permissions, and explicit user constraints MUST remain enforced.
- Relaxed results MUST be distinguishable from exact matches when user expectations could be affected.
- Recovery strategies MUST be evaluated for precision as well as reduction in zero-result rate.

## MUST NOT
- MUST NOT return unrelated results merely to avoid an empty page.
- MUST NOT relax authorization, tenant, or mandatory policy constraints.
- MUST NOT hide systematic indexing failures behind fallback retrieval.

## SHOULD
- Offer actionable reformulations or suggestions when high-confidence recovery is unavailable.

## Exceptions
Require documented relaxation semantics, evidence, and risk review.

## Verification
Review fallback logic, zero-result dashboards, query samples, filter tests, and relevance judgments.