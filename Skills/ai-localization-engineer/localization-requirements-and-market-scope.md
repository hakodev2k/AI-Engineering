# Localization Requirements and Market Scope

## Purpose
Define what an AI product must support across languages, locales, scripts, regions, and regulatory contexts before implementation begins.

## When to use
Use for new market launches, language expansion, major model changes, or when product requirements say only “support multiple languages.”

## Inputs
Target markets, user segments, product flows, model capabilities, data sources, legal constraints, launch dates, quality goals, and supported channels.

## Preconditions
Business owners and intended markets are identifiable.

## Context to inspect
Inspect current locale handling, prompts, UI strings, retrieval sources, evaluation datasets, model routing, content policies, analytics, and fallback behavior.

## Core knowledge
Language and locale are not interchangeable. A Senior engineer distinguishes language, region, script, writing direction, formatting conventions, cultural expectations, policy constraints, and domain terminology. AI behavior must be validated per market rather than assumed transferable from English.

## Procedure
1. Enumerate target markets and canonical locale identifiers.
2. Map user journeys requiring localized behavior.
3. Classify content as static, generated, retrieved, transcribed, synthesized, or user-provided.
4. Identify locale-sensitive data, formatting, compliance, and safety requirements.
5. Record model and vendor support by locale.
6. Define quality thresholds and fallback behavior.
7. Identify launch blockers and dependencies.
8. Produce a scoped localization contract for implementation and evaluation.

## Decision points
Use one language variant only when regional differences do not affect meaning, compliance, terminology, or user trust. Separate locales when these factors materially differ.

## Common failure patterns
Equating translation with localization, ignoring unsupported scripts, assuming English prompt behavior transfers, and launching without locale-specific evaluation.

## Verification
Confirm every target market maps to supported journeys, locale settings, model behavior, data sources, fallback rules, and measurable acceptance criteria.

## Expected output
A localization scope matrix with markets, locales, capabilities, risks, quality targets, and owners.

## Stop conditions
Stop when target markets are undefined, regulatory ownership is unresolved, or critical model capabilities cannot be validated for the locale.