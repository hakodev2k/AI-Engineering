# Multilingual Evaluation Strategy

## Purpose
Design evaluation coverage that measures AI quality separately across languages, locales, scripts, domains, and risk classes.

## When to use
Use before multilingual launch, model migration, prompt changes, retrieval changes, or quality investigations.

## Inputs
Supported locales, target tasks, risk tiers, model versions, production distributions, existing evals, human-rating capacity, and acceptance thresholds.

## Preconditions
Core product behaviors and target markets are defined.

## Context to inspect
Inspect source-language evals, locale traffic, error reports, model benchmarks, prompt variants, RAG corpora, safety policies, and historical regressions.

## Core knowledge
Aggregate multilingual scores can hide severe failures in lower-volume locales. Evaluation sets should represent linguistic phenomena, real tasks, dialects, scripts, code-switching, and market-specific risks rather than mechanically translated English examples.

## Procedure
1. Define dimensions of quality: correctness, fluency, instruction following, safety, grounding, format, and task success.
2. Segment evaluation by locale and risk class.
3. Mix native-authored, translated, adversarial, and production-derived cases.
4. Establish human-rater guidance and calibration.
5. Define locale-level and global thresholds.
6. Run deterministic checks where possible and sampled human review where judgment is required.
7. Analyze error distributions instead of averages only.
8. Gate release on critical locale failures and track regressions over time.

## Decision points
Use automated metrics for stable structural properties; use human evaluation for semantic quality, naturalness, cultural fit, and nuanced safety.

## Common failure patterns
Translated-only test sets, English-centric labels, tiny samples, averaging away weak locales, and changing model plus prompt plus dataset simultaneously.

## Verification
Confirm each supported locale has representative coverage, calibrated labels, reproducible system configuration, and explicit pass/fail criteria.

## Expected output
A multilingual evaluation plan, datasets, scorecard, failure taxonomy, and release thresholds.

## Stop conditions
Stop when required locales lack trustworthy evaluators or critical behaviors cannot be measured reliably.