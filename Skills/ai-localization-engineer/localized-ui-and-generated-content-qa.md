# Localized UI and Generated Content QA

## Purpose
Validate the combined experience of localized UI and AI-generated content, including layout, semantics, interaction state, and locale-sensitive formatting.

## When to use
Use before locale launch, after UI redesign, or when generated text interacts with buttons, forms, tables, notifications, or structured components.

## Inputs
Build, target locales, test scenarios, translations, model configuration, device/browser matrix, and acceptance criteria.

## Preconditions
A test environment can reproduce locale-specific UI and AI behavior.

## Context to inspect
Inspect translation catalogs, responsive layouts, component constraints, markdown rendering, form validation, generated labels, placeholders, error states, and accessibility metadata.

## Core knowledge
UI localization defects emerge from text expansion, grammar dependencies, concatenation, directionality, variable insertion, and mismatch between static and generated language. AI output can violate component assumptions even when linguistically correct.

## Procedure
1. Build representative journeys per locale.
2. Test static strings and generated content together.
3. Check truncation, wrapping, alignment, pluralization, variables, and formatting.
4. Validate language consistency across UI and model output.
5. Exercise errors, empty states, long generations, and mixed-language inputs.
6. Test supported device and browser breakpoints.
7. Record defects with exact locale, input, output, and component context.
8. Add stable defects to automated or visual regression suites where practical.

## Decision points
Use automated screenshot and structural tests for repeatable layout rules; use native human review for semantic and interaction quality.

## Common failure patterns
Testing strings outside real components, English-only edge cases, concatenated grammar, clipped generated content, and fixing layout with locale-specific hacks.

## Verification
Critical journeys pass locale-specific functional, visual, and semantic checks with no unresolved high-severity issues.

## Expected output
A reproducible localization QA report and regression coverage for critical journeys.

## Stop conditions
Stop when the build, model configuration, or translation version cannot be identified reliably enough to reproduce defects.