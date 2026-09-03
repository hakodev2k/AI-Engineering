# Query Understanding Rules

## Purpose
Translate user requests into retrieval intent without altering security boundaries or inventing unsupported constraints.

## Scope
Applies to query rewriting, intent detection, entity extraction, decomposition, expansion, spelling normalization, and conversational context resolution.

## MUST
- Query transformations MUST preserve the user's material intent and authorization scope.
- Rewrites MUST be observable enough to compare the original query with retrieval queries during debugging.
- Ambiguous conversational references MUST use available conversation context deterministically where practical.
- Query decomposition MUST preserve dependencies between subquestions when answer correctness depends on them.
- Expansion terms MUST be bounded to avoid semantic drift and irrelevant recall.
- Security-sensitive terms MUST NOT be removed merely to improve retrieval success.

## MUST NOT
- Query understanding MUST NOT add facts or assumptions that are later presented as user-provided constraints.
- Rewriting MUST NOT broaden tenant, principal, time, geography, or classification scope beyond authorization.
- Failed intent classification MUST NOT silently route to a high-risk tool or privileged retrieval path.

## SHOULD
- Maintain representative tests for terse, multilingual, misspelled, adversarial, and multi-intent queries.
- Prefer minimal transformations when the original query already retrieves well.
- Capture rewrite effectiveness as part of retrieval evaluation.

## Exceptions
Exceptions require documented rationale, affected query classes, risk, and evidence that the alternative improves correctness without weakening security.

## Verification
Inspect original-to-rewritten query traces, intent test suites, authorization tests, retrieval benchmarks, and adversarial examples for semantic drift.