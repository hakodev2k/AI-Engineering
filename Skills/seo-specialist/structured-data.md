# Structured Data

## Purpose
Implement eligible machine-readable entity and page information accurately and maintainably.

## When to use
Use when page content genuinely qualifies for supported structured-data types or existing markup is invalid.

## Inputs
Page content, schema requirements, templates, structured-data tests, and search documentation.

## Context to inspect
Visible content, entity relationships, template variables, generated JSON-LD, validation errors, and deployment behavior.

## Core knowledge
Structured data must represent visible truthful content. Valid markup does not guarantee rich results; eligibility, quality, and search policies still apply.

## Procedure
1. Identify eligible page types and supported properties.
2. Map page facts to the appropriate schema vocabulary.
3. Prefer template-generated JSON-LD when maintainable.
4. Include required properties and useful recommended properties backed by content.
5. Validate syntax and semantic consistency.
6. Test representative variants and edge cases.
7. Monitor enhancements and errors after deployment.

## Decision points
Do not add markup solely because a schema type exists. Choose the most specific truthful type without inventing unavailable properties.

## Common failure patterns
Marking hidden content, fake ratings, stale prices, inconsistent entities, malformed JSON-LD, and hand-maintaining markup at scale.

## Verification
Run validators, inspect production HTML, compare markup to visible content, and monitor search enhancement reports.

## Expected output
Validated implementation requirements, coverage scope, test evidence, and monitoring plan.

## Stop conditions
Stop when required facts cannot be verified or markup could misrepresent content.