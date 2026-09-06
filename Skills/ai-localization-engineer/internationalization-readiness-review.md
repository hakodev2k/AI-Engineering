# Internationalization Readiness Review

## Purpose
Assess whether an application and AI stack can support new locales without brittle code changes or content corruption.

## When to use
Use before localization begins, during architecture review, or when new-language launches expose recurring engineering defects.

## Inputs
Repository, UI framework, API contracts, data models, rendering stack, prompts, content pipeline, storage, and target locale requirements.

## Preconditions
Relevant source code and architecture are available for inspection.

## Context to inspect
Inspect hard-coded strings, Unicode handling, locale libraries, date/number formatting, sorting, pluralization, text expansion, RTL support, database collations, validation, prompt assets, and external integrations.

## Core knowledge
Internationalization separates locale-sensitive behavior from business logic. Unicode correctness, grapheme handling, collation, formatting, bidirectional text, plural rules, and content expansion are engineering concerns, not translation concerns.

## Procedure
1. Inventory user-visible and model-visible text sources.
2. Identify hard-coded locale assumptions.
3. Verify Unicode-safe storage and transport.
4. Review formatting, collation, pluralization, and segmentation.
5. Test long strings, combining characters, emoji, and non-Latin scripts.
6. Check RTL layout and mixed-direction content where relevant.
7. Review APIs and schemas for locale propagation.
8. Record defects by severity and remediation owner.
9. Add automated i18n checks to CI where feasible.

## Decision points
Refactor centrally when the issue affects many locales; use targeted adaptation only when behavior is genuinely market-specific.

## Common failure patterns
String concatenation, fixed-width layouts, ASCII assumptions, locale-dependent parsing, storing formatted values instead of canonical data, and missing locale context in APIs.

## Verification
Run representative locale smoke tests and automated checks; confirm storage, rendering, parsing, and AI prompt paths preserve intended content.

## Expected output
An i18n readiness assessment with blockers, architecture recommendations, and verified remediation criteria.

## Stop conditions
Stop when fixes require schema migration or platform changes beyond authorized scope and escalate with evidence.