# Internationalization Rules

## Purpose
Ensure Vue interfaces support locale differences without corrupting meaning, layout, or data.

## Scope
Translations, locale formatting, pluralization, dates, numbers, currencies, directionality, and localized routes/content.

## MUST
- User-visible translatable strings MUST be separated from application logic according to the project's localization architecture.
- Dates, numbers, currencies, and plural forms MUST use locale-aware formatting when presented as localized content.
- Stored/transmitted canonical values MUST remain distinct from locale-specific display formatting.
- Missing translation behavior MUST be deterministic and observable in testing or monitoring.
- Layouts used by supported locales MUST tolerate realistic text expansion and directionality requirements.

## MUST NOT
- Translated strings MUST NOT be assembled from fragments when grammar can vary by locale.
- Locale-formatted display strings MUST NOT be parsed as authoritative canonical data unless the parsing contract is explicit.
- Security-sensitive identifiers MUST NOT be transformed by localization logic.

## SHOULD
- Use stable semantic translation keys and provide translator context for ambiguous text.
- Test representative long strings and non-default locales before release.

## Exceptions
Single-locale products may defer localization infrastructure when that product constraint is explicit and future migration cost is understood.

## Verification
Run locale-specific tests, missing-key checks, visual reviews, and canonical/display value round-trip tests.