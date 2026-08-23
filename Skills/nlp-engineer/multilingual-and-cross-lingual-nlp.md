# Multilingual and Cross-Lingual NLP

## Purpose
Design NLP systems that perform reliably across languages, scripts, locales, and code-switching conditions rather than treating English performance as representative.

## When to use
Use for multilingual products, regional expansion, translation-assisted pipelines, or any corpus with material language diversity.

## Inputs
Target languages/locales, traffic distribution, labeled data, tokenizer/model candidates, human evaluators, latency/cost limits.

## Preconditions
Language coverage priorities and minimum quality thresholds are known.

## Context to inspect
Per-language data volume, token expansion, script handling, locale conventions, dialects, code-switching, translation artifacts, evaluation coverage.

## Core knowledge
Cross-lingual transfer is uneven. Tokenization efficiency, cultural semantics, morphology, resource availability, and evaluation quality vary substantially by language.

## Procedure
1. Measure language and locale distribution in real traffic.
2. Define per-language acceptance thresholds and critical slices.
3. Evaluate tokenizer fragmentation and context consumption.
4. Compare multilingual model, per-language model, and translation-mediated baselines.
5. Build native-language evaluation sets with qualified reviewers.
6. Test names, dates, numbers, dialects, scripts, and code-switching.
7. Analyze per-language calibration and failure modes.
8. Avoid averaging away low-resource language failures.
9. Define fallback behavior for unsupported languages.
10. Monitor language mix and quality drift after launch.

## Decision points
Use one multilingual model when shared semantics and operational simplicity dominate; specialized models when high-volume languages justify materially better quality. Translation mediation is useful when latency and semantic loss are acceptable.

## Common failure patterns
Machine-translated test sets only, English-derived thresholds, language detection mistakes, Unicode assumptions, and ignoring tokenizer cost disparities.

## Verification
Native-language evaluation, per-language metrics, locale edge cases, and production token/latency measurements pass.

## Expected output
Language coverage matrix, model strategy, evaluation sets, fallback rules, and per-language quality report.

## Stop conditions
Stop if qualified evaluation is unavailable for a high-risk language or minimum quality cannot be achieved.