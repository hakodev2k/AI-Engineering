# Internationalization and Localization Rules

## Purpose
Prevent locale assumptions from becoming correctness, accessibility, or compatibility defects.

## Scope
Translations, dates, numbers, currencies, pluralization, layout direction, locale data, and translated content.

## MUST
- Use locale-aware formatting for user-visible dates, numbers, and currencies.
- Keep translatable text out of concatenation patterns that prevent correct grammar or reordering.
- Define fallback behavior for missing translations and unsupported locales.
- Test critical layouts with representative long text and supported directionality where applicable.

## MUST NOT
- Assume English word order, fixed text length, Gregorian display, or one numeric format when multiple locales are supported.
- Use translated display strings as stable business identifiers.
- Expose untranslated internal keys as silent production fallback.

## SHOULD
- Keep translation keys semantically stable and provide translators enough context for ambiguous messages.

## Exceptions
Locale-specific products may intentionally support one locale when that scope is explicit and future expansion assumptions are not embedded unnecessarily.

## Verification
Run locale builds/tests, pseudo-localization where available, formatting tests, layout review, and missing-key checks.