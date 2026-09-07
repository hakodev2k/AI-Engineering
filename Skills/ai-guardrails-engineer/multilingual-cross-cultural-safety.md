# Multilingual and Cross-Cultural Safety

## Purpose
Maintain guardrail effectiveness across languages, dialects, code-switching, transliteration, culture.

## When to use
Use for multilingual products/content.

## Inputs
Languages, traffic, taxonomy, evaluation, locale requirements, models, incidents.

## Context to inspect
Inspect language detection, translation, tokenization, interpretation, thresholds, fallback.

## Core knowledge
Performance varies by language; translation may distort meaning and English-only benchmarks are insufficient.

## Procedure
1. Rank language risk.
2. Build native slices.
3. Add dialect/slang/code-switching/obfuscation.
4. Compare native/translation pipelines.
5. Calibrate with evidence.
6. Define unsupported fallback.
7. Review locale ambiguity.
8. Monitor errors/appeals.
9. Add incident regressions.
10. Re-evaluate changes.

## Decision points
Prefer validated native controls; translation adds latency/privacy/semantic risk.

## Common failure patterns
English assumptions, translated-only tests, no dialects, silent fallback, universal thresholds.

## Verification
Per-language risk metrics and reviewed boundaries.

## Expected output
Multilingual coverage evidence.

## Stop conditions
Restrict high-risk unsupported languages.