# Spelling and Synonym Rules

## Purpose
Improve recall for language variation without unintended semantic expansion.

## Scope
Applies to spell correction, synonyms, aliases, acronyms, stemming, transliteration, and normalization.

## MUST
- Corrections and synonym expansions MUST preserve high-confidence exact matches and important identifiers.
- Synonym sets MUST define directionality when equivalence is not symmetric.
- High-impact dictionary changes MUST be regression-tested on representative queries.
- Automatic correction MUST have a safe fallback when confidence is low.

## MUST NOT
- MUST NOT rewrite identifiers or quoted terms without explicit evidence.
- MUST NOT treat broad topical similarity as synonymy.
- MUST NOT deploy unreviewed synonym expansions that materially alter result eligibility.

## SHOULD
- Prefer observed query evidence and domain expertise over speculative expansions.

## Exceptions
Require documented term classes, evidence, risk, and rollback.

## Verification
Inspect dictionaries, correction logs, golden query sets, exact-match tests, and before/after judgments.