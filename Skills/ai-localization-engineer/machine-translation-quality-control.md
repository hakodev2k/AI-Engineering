# Machine Translation Quality Control

## Purpose
Establish production-grade controls for machine-translated content used in AI products, including acceptance thresholds, post-editing, escalation, and regression handling.

## When to use
Use when translation engines or LLMs generate localized UI, support, knowledge, prompt, or user-facing content.

## Inputs
Source content, target locales, translation engines, glossary, style guide, quality criteria, risk classification, and reviewer capacity.

## Preconditions
Content classes and consequences of translation errors are known.

## Context to inspect
Inspect translation pipelines, prompt templates, caches, human-review steps, previous defects, terminology assets, and release workflows.

## Core knowledge
Translation quality is multidimensional: adequacy, fluency, terminology, style, formatting, locale conventions, and safety. High-risk content requires stricter review than reversible low-impact copy.

## Procedure
1. Classify content by risk and lifetime.
2. Select engines based on locale and domain evidence.
3. Apply terminology and protected-token constraints.
4. Run structural checks for markup, variables, numbers, and links.
5. Score or sample semantic quality using suitable metrics and human review.
6. Route high-risk or low-confidence output to qualified reviewers.
7. Record defects by category and engine/version.
8. Add recurring failures to regression suites.

## Decision points
Use fully automated translation for low-risk, measurable content; require post-editing for nuanced or high-impact content. Prefer domain-tuned workflows when general engines consistently miss terminology.

## Common failure patterns
Accepting fluent but incorrect translations, corrupting placeholders, translating product identifiers, ignoring locale-specific legal wording, and relying on a single automatic metric.

## Verification
Validate representative samples per locale and risk tier, check protected tokens and structure automatically, and confirm severe-error rates stay below release thresholds.

## Expected output
A translation quality-control workflow with risk tiers, gates, review rules, metrics, and defect tracking.

## Stop conditions
Stop when high-risk output lacks qualified review or the selected engine cannot meet minimum semantic accuracy.