# Query Understanding Rules

## Purpose
Transform user requests into retrieval intent without silently changing meaning.

## Scope
Query rewriting, decomposition, expansion, language detection, entity extraction, and intent routing.

## MUST
- Query transformations MUST preserve the user's material constraints and requested scope.
- Rewrites MUST be observable and attributable to a specific strategy or version.
- Multi-part questions MUST retain all material subquestions when decomposed.
- Ambiguous expansions MUST be evaluated against representative queries before production use.
- Security-sensitive terms MUST NOT be removed merely to increase retrieval recall.

## MUST NOT
- MUST NOT invent entities, dates, or filters not supported by the request or trusted context.
- MUST NOT broaden queries across authorization boundaries.
- MUST NOT hide transformations that materially alter retrieval behavior.

## SHOULD
- Prefer minimal rewrites when the original query already retrieves well.
- Preserve original query alongside transformed variants for diagnosis.

## Exceptions
Aggressive rewriting requires measured quality benefit and bounded failure analysis.

## Verification
Review rewrite traces, decomposition tests, retrieval comparisons, and constraint-preservation evaluations.