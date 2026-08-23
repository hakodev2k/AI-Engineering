# Internationalization and Localization

## Purpose
Engineer frontend experiences that support multiple languages, locales, writing directions, formats, and content expansion without embedding locale assumptions in business logic.

## When to use
Use when adding locales, formatting dates/numbers/currency, supporting RTL, translating dynamic content, or preparing a product for international markets.

## Inputs
Supported locales, translation workflow, formatting requirements, fallback policy, content ownership, and design constraints.

## Context to inspect
Hard-coded strings, message catalogs, interpolation, date/number formatting, pluralization, route locale handling, layout assumptions, and translation loading.

## Core knowledge
Localization is more than string replacement. Grammar, plurals, date/time zones, number/currency formats, text expansion, RTL, and fallback behavior affect implementation. Use platform internationalization APIs rather than manual formatting.

## Procedure
1. Inventory user-visible hard-coded content and locale assumptions.
2. Define stable message identifiers and ownership.
3. Use structured interpolation rather than string concatenation.
4. Implement plural/select rules through the localization system.
5. Format dates, times, numbers, and currencies with locale-aware APIs.
6. Define locale detection, persistence, and fallback.
7. Support text expansion and RTL with logical layout properties.
8. Decide translation loading/caching strategy.
9. Test missing translations, long strings, RTL, and locale-specific formats.
10. Verify critical workflows in representative locales.

## Decision points
Use route-based locale when shareable localized URLs matter; use preference-based locale when URLs should remain language-neutral. Translate server content at the owning layer rather than duplicating inconsistent translations in the client.

## Common failure patterns
String concatenation, hard-coded date formats, assuming English word order, fixed-width labels, using flags as language identifiers, and silently showing message keys.

## Verification
Representative locales render correctly, formatting follows locale rules, RTL workflows remain usable, missing translations degrade predictably, and no critical strings remain hard-coded.

## Expected output
A locale-aware frontend with maintainable message, formatting, layout, loading, and fallback behavior.

## Stop conditions
Escalate when legal/business translations are unavailable, timezone semantics are ambiguous, or product requirements conflict about locale ownership.