# Localization-ready Content

## Purpose
Design source documentation that can be translated accurately and maintained across locales without semantic drift.
## When to use
Use when content serves multilingual users or is expected to localize later.
## Inputs
Source content, supported locales, terminology, localization tooling, UI strings, release cadence.
## Context to inspect
String reuse, screenshots, idioms, variables, locale-specific behavior, translation memory.
## Core knowledge
Localization readiness begins in source writing. Stable terminology, explicit references, and modular content reduce translation ambiguity and cost.
## Procedure
1. Use clear sentences and consistent canonical terms.
2. Avoid idioms, culture-specific jokes, and ambiguous pronouns.
3. Keep variables/code/placeholders protected and explained.
4. Avoid embedding text in images where possible.
5. Separate locale-specific legal, date, number, and workflow behavior.
6. Coordinate terminology with product localization.
7. Design reusable content without fragmenting sentence grammar.
8. Preview expansion and bidirectional/layout constraints where relevant.
9. Establish source-change and translation update workflow.
## Decision points
Localize high-value user journeys first when full coverage is impractical; do not mix untranslated critical steps silently.
## Common failure patterns
Concatenated fragments, screenshot text, inconsistent UI terms, ambiguous placeholders, and source churn during translation.
## Verification
Pseudo-localization or sample translation reveals no broken placeholders, layout assumptions, or semantic ambiguity.
## Expected output
Translation-friendly canonical source content.
## Stop conditions
Escalate legal or locale-specific claims requiring qualified regional review.