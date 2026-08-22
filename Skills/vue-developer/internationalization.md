# Internationalization

## Purpose
Design Vue localization that handles language, formatting, layout, routing, and content changes without scattering locale logic through components.

## When to use
Use for multilingual products, locale expansion, formatting defects, and internationalized routing/content.

## Inputs
Supported locales, translation catalog, formatting rules, routing requirements, and fallback policy.

## Context to inspect
Inspect i18n library/config, hard-coded strings, date/number formatting, pluralization, locale persistence, and server locale behavior.

## Core knowledge
Localization includes plural rules, dates, numbers, currencies, text expansion, directionality, and fallback—not string replacement alone. Locale-sensitive values should use standard internationalization APIs.

## Procedure
1. Define supported locales and fallback behavior.
2. Extract user-facing strings into stable translation keys.
3. Use locale-aware date, number, currency, and plural formatting.
4. Avoid concatenating translated fragments.
5. Decide locale ownership and persistence.
6. Lazy-load catalogs when useful.
7. Test text expansion and missing translations.
8. Verify route/SEO behavior if locale appears in URLs.
9. Test representative locales in CI or visual review.

## Decision points
Use semantic keys when wording changes independently; content-based keys only when translation workflow supports them. Put locale in URL when shareability/SEO requires it.

## Common failure patterns
Hard-coded strings, manual date formatting, concatenated grammar, assuming English plural rules, silently missing keys, and layouts that break with longer text.

## Verification
Switch locales at runtime, verify formatting and fallbacks, scan for untranslated content, and test representative layouts.

## Expected output
Consistent localization behavior with maintainable catalogs and formatting.

## Stop conditions
Stop when authoritative translations or locale-specific business rules are unavailable.