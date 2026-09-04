# Collation, Sorting, and Search Rules

## Purpose
Ensure ordering and text matching behave predictably across scripts and locales.

## Scope
Applies to user-visible sorting, collation, case/diacritic sensitivity, search normalization, and locale-aware comparison.

## MUST
- User-visible alphabetical sorting MUST use a locale-appropriate collation policy when language-sensitive order is expected.
- Search and comparison behavior MUST explicitly define case, accent, punctuation, width, and normalization sensitivity.
- Database collation choices MUST be reviewed against application comparison semantics before schema or index changes.
- Stable secondary sort keys MUST be defined where collation can produce equivalent primary order.
- Search indexes MUST preserve a reproducible relationship between indexed normalization and query normalization.

## MUST NOT
- Binary or ordinal ordering MUST NOT be presented as linguistic alphabetical order unless that behavior is an explicit requirement.
- Lowercasing alone MUST NOT be treated as universally correct case-insensitive comparison.
- Collation changes affecting persisted indexes or uniqueness MUST NOT be deployed without migration and compatibility analysis.

## SHOULD
- Search behavior SHOULD be evaluated with native-language queries and realistic spelling variants.
- Locale-independent identifiers SHOULD use locale-independent comparison semantics.

## Exceptions
Exceptions require documented domain semantics, impacted locales, compatibility risk, and evidence that users receive predictable results.

## Verification
Test representative scripts, accents, case variants, equivalent Unicode forms, punctuation, numeric text, ties, database query behavior, and search-index consistency.