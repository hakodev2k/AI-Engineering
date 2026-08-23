# Localization and Internationalization

## Purpose
Design iOS features that correctly handle translated text, pluralization, locale-sensitive formatting, right-to-left layouts, and localized assets.

## When to use
Use for any user-facing text/data formatting and when adding locales or fixing locale-specific defects.

## Inputs
Supported locales, content types, translation workflow, design constraints.

## Context to inspect
String catalogs/resources, interpolation/plurals, formatters, layout direction, images, server-provided content, accessibility labels.

## Core knowledge
Localization is not string replacement. Grammar, plural rules, date/number/currency formats, text expansion, and bidirectional layout vary by locale.

## Procedure
1. Externalize user-facing strings with stable semantic keys.
2. Provide translator context and avoid concatenating sentence fragments.
3. Use locale-aware formatters for dates, numbers, currency, units, and lists.
4. Model plurals/variants with localization tooling.
5. Make layouts resilient to expansion and RTL direction.
6. Mirror directional imagery only when semantically appropriate.
7. Keep identifiers/protocol values locale-independent.
8. Test pseudolocalization and representative complex locales.
9. Validate localized accessibility content.

## Decision points
Use server-localized content when content lifecycle demands centralized control; otherwise prefer client resources for offline/versioned UI copy.

## Common failure patterns
Hard-coded strings, string concatenation, fixed widths, locale-sensitive parsing of machine data, forced LTR layout, and untranslated error paths.

## Verification
Run pseudolocalization, RTL, long-text, plural, calendar/time-zone, and locale-format tests on key flows.

## Expected output
Locale-safe resources, formatting, layouts, and translation-ready context.

## Stop conditions
Stop when product has not defined source-language meaning or legal/localized copy requires specialist approval.