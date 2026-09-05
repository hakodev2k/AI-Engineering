# Query Understanding Rules

## Purpose
Ensure query interpretation is explicit, testable, and robust across user language and intent.

## Scope
Applies to parsing, intent classification, entity recognition, query rewriting, normalization, and language detection.

## MUST
- Query transformations MUST preserve the original user intent unless a documented rewrite policy intentionally broadens or narrows it.
- High-impact rewrites MUST be evaluated on representative and adversarial query sets.
- Language, locale, and domain assumptions MUST be explicit when they affect interpretation.
- Confidence-dependent query understanding behavior MUST define fallback handling for uncertain cases.

## MUST NOT
- MUST NOT silently drop semantically important tokens.
- MUST NOT apply aggressive normalization that changes identifiers, codes, names, or quoted terms without evidence.
- MUST NOT rely on a single intent classifier output when low confidence can materially alter results.

## SHOULD
- Preserve original query features for debugging and comparison.
- Test short, ambiguous, misspelled, multilingual, and structured queries.

## Exceptions
Exceptions require affected query classes, evidence, bounded risk, and verification.

## Verification
Inspect transformation traces, golden query tests, confusion analysis, logs, and sampled production queries under privacy controls.