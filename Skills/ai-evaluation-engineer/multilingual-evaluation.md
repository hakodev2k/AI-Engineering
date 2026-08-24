# Multilingual Evaluation

## Purpose
Evaluate AI quality across languages and locales without assuming English results generalize.

## When to use
Use when serving multilingual users, localizing prompts, adding language coverage, or comparing models with different multilingual strengths.

## Inputs
- Supported language/locale list
- Representative tasks per locale
- Native-language reviewers or trusted references
- Production traffic distribution
- Safety and policy requirements

## Context to inspect
Inspect language detection, translation layers, locale-specific formatting, cultural conventions, domain terminology, tokenizer behavior, and traffic by locale.

## Core knowledge
Translation-equivalent tasks are useful for controlled comparison but do not replace native tasks. Quality, safety, politeness, factuality, and ambiguity can vary by language. Low-resource languages often need expert review and wider uncertainty bounds.

## Procedure
1. Prioritize languages by user impact and risk, not only traffic volume.
2. Create both parallel translated cases and native locale-specific cases.
3. Validate translations with fluent reviewers rather than automatic translation alone.
4. Evaluate task success, fluency, terminology, safety, and locale conventions separately.
5. Test mixed-language and code-switching inputs where relevant.
6. Measure refusal and policy consistency across languages.
7. Analyze language-specific retrieval or tool failures.
8. Use native reviewers for ambiguous semantic judgments.
9. Report per-language results before any global aggregate.
10. Maintain regression cases for language-specific incidents.

## Decision points
Use translated parallel sets for controlled model comparison; use native-authored sets for product realism. Require stronger human review where judge models or automatic metrics are poorly calibrated for a language.

## Common failure patterns
- Translating English benchmarks and calling coverage complete
- Aggregating all languages into one score
- English-only safety evaluation
- Ignoring locale formatting and terminology
- Using non-fluent annotators

## Verification
Verify translation quality, reviewer fluency, per-language sample sizes, agreement, and reproducibility of critical failures.

## Expected output
A language-sliced evaluation report with capability, safety, locale quality, uncertainty, and coverage gaps.

## Stop conditions
Stop when no trustworthy reviewer or reference exists for a consequential language, or sample sizes cannot support the intended release claim.